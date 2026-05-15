'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarData, CleaningEvent } from '@/lib/types';
import { getCleaningsFromAllListings } from '@/lib/utils';

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface UseCalendarReturn {
  cleanings: CleaningEvent[];
  loading: boolean;
  error: string | null;
  warnings: string[];
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
  const [warnings, setWarnings] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchCalendar = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/calendar');
      const data: CalendarData & { error?: string } = await response.json();

      if (!response.ok) {
        const msg =
          typeof data.error === 'string'
            ? data.error
            : 'No se pudo cargar el calendario';
        throw new Error(msg);
      }

      const cleaningEvents = getCleaningsFromAllListings(data.reservations);

      setCleanings(cleaningEvents);
      setWarnings(Array.isArray(data.warnings) ? data.warnings : []);
      setLastUpdated(new Date().toLocaleTimeString('es-ES'));
      setError(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'No se pudo cargar el calendario';
      setError(msg);
      setWarnings([]);
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
    warnings,
    lastUpdated,
    refresh: fetchCalendar,
  };
}

