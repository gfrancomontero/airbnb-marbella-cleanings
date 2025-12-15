'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarData, CleaningEvent } from '@/lib/types';
import { getCleaningsFromReservations } from '@/lib/utils';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface UseCalendarReturn {
  cleanings: CleaningEvent[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage calendar/cleaning data.
 * Automatically refreshes every 5 minutes.
 */
export function useCalendar(): UseCalendarReturn {
  const [cleanings, setCleanings] = useState<CleaningEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchCalendar = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/calendar');
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar');
      }
      
      const data: CalendarData = await response.json();
      const cleaningEvents = getCleaningsFromReservations(data.reservations);
      
      setCleanings(cleaningEvents);
      setLastUpdated(new Date().toLocaleTimeString('es-ES'));
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el calendario');
      console.error('Calendar fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendar();
    
    const interval = setInterval(fetchCalendar, REFRESH_INTERVAL_MS);
    
    return () => clearInterval(interval);
  }, [fetchCalendar]);

  return {
    cleanings,
    loading,
    error,
    lastUpdated,
    refresh: fetchCalendar,
  };
}

