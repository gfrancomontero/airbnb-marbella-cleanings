'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarData } from '@/lib/types';
import { 
  getPastCleaningsFromReservations,
  generateHalfMonthPeriods,
  assignCleaningsToPeriods,
  HalfMonthPeriod,
} from '@/lib/utils';

interface UsePastCleaningsReturn {
  periods: HalfMonthPeriod[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch and organize past cleanings by half-month periods.
 */
export function usePastCleanings(): UsePastCleaningsReturn {
  const [periods, setPeriods] = useState<HalfMonthPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPastCleanings = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/calendar');
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar');
      }
      
      const data: CalendarData = await response.json();
      const pastCleanings = getPastCleaningsFromReservations(data.reservations);
      
      // Generate half-month periods and assign cleanings
      const emptyPeriods = generateHalfMonthPeriods();
      const periodsWithCleanings = assignCleaningsToPeriods(emptyPeriods, pastCleanings);
      
      setPeriods(periodsWithCleanings);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el historial');
      console.error('Past cleanings fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPastCleanings();
  }, [fetchPastCleanings]);

  return {
    periods,
    loading,
    error,
    refresh: fetchPastCleanings,
  };
}

