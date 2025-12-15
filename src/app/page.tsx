'use client';

import { useState, useEffect } from 'react';
import { CalendarData, CleaningEvent } from '@/lib/types';
import { getCleaningsFromReservations, getDayLabel } from '@/lib/utils';

export default function Home() {
  const [cleanings, setCleanings] = useState<CleaningEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/calendar');
      if (!response.ok) {
        throw new Error('Failed to fetch calendar');
      }
      const data: CalendarData = await response.json();
      const cleaningEvents = getCleaningsFromReservations(data.reservations);
      setCleanings(cleaningEvents);
      setLastUpdated(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError('Unable to load calendar data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
    // Refresh every 5 minutes
    const interval = setInterval(fetchCalendar, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const nextCleaning = cleanings[0];
  const upcomingCleanings = cleanings.slice(0, 10);
  const gapAlerts = cleanings.filter(c => c.hasGapAfter && c.daysFromNow <= 7);

  if (loading && cleanings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-teal-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium tracking-wide">Loading your schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="pt-10 pb-6 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Marbella Cleanings
            </h1>
          </div>
          <p className="text-slate-500 text-sm">Airbnb cleaning schedule • Updated {lastUpdated || 'just now'}</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 pb-12 space-y-6">
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-rose-800 font-medium">{error}</p>
              <button onClick={fetchCalendar} className="text-rose-600 text-sm hover:underline">
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Gap Alerts */}
        {gapAlerts.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-amber-900 font-bold text-lg">Potential Last-Minute Bookings</h2>
                <p className="text-amber-700 text-sm">Gaps in the schedule - be prepared!</p>
              </div>
            </div>
            <div className="space-y-2">
              {gapAlerts.map((alert, index) => (
                <div key={index} className="bg-white/60 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-slate-800 font-medium">{alert.formattedDate}</p>
                    <p className="text-amber-600 text-sm font-medium">
                      {alert.gapDays} day{alert.gapDays > 1 ? 's' : ''} gap after checkout
                    </p>
                  </div>
                  <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ⚠️ Alert
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Cleaning - Hero Card */}
        {nextCleaning && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 p-6 text-white shadow-xl shadow-teal-200">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-medium">
                  Next Cleaning
                </span>
                {nextCleaning.isToday && (
                  <span className="bg-white text-teal-600 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    TODAY
                  </span>
                )}
                {nextCleaning.isTomorrow && (
                  <span className="bg-white/90 text-teal-600 px-3 py-1 rounded-full text-sm font-bold">
                    TOMORROW
                  </span>
                )}
              </div>
              
              <h2 className="text-3xl font-bold mb-1 tracking-tight">
                {nextCleaning.formattedDate}
              </h2>
              <p className="text-xl text-white/90 font-medium">
                {nextCleaning.formattedTime}
              </p>
              
              {!nextCleaning.isToday && !nextCleaning.isTomorrow && (
                <p className="mt-3 text-white/70 text-sm">
                  {getDayLabel(nextCleaning.daysFromNow)}
                </p>
              )}

              {nextCleaning.hasGapAfter && (
                <div className="mt-4 bg-amber-400/30 backdrop-blur rounded-xl px-4 py-2 inline-flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <span className="text-sm font-medium">
                    {nextCleaning.gapDays} day gap after - possible extra cleaning!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Cleanings List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-slate-100 border border-white">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-800">Upcoming Cleanings</h2>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
              Next 10
            </span>
          </div>
          
          {upcomingCleanings.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-500">No upcoming cleanings scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingCleanings.map((cleaning, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl p-4 transition-all hover:scale-[1.02] ${
                    cleaning.isToday
                      ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-300'
                      : cleaning.isTomorrow
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                      : 'bg-slate-50 border border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                        cleaning.isToday
                          ? 'bg-teal-500 text-white'
                          : cleaning.isTomorrow
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}>
                        {cleaning.date.getDate()}
                      </div>
                      <div>
                        <p className={`font-semibold ${
                          cleaning.isToday || cleaning.isTomorrow ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {cleaning.formattedDate}
                        </p>
                        <p className="text-slate-500 text-sm">{cleaning.formattedTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {cleaning.hasGapAfter && (
                        <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{cleaning.gapDays}d gap</span>
                        </div>
                      )}
                      {cleaning.isToday && (
                        <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Today
                        </span>
                      )}
                      {cleaning.isTomorrow && (
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Tomorrow
                        </span>
                      )}
                      {!cleaning.isToday && !cleaning.isTomorrow && cleaning.daysFromNow < 7 && (
                        <span className="text-slate-400 text-sm">
                          {getDayLabel(cleaning.daysFromNow)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-6">
          <button
            onClick={fetchCalendar}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-slate-600 px-5 py-2.5 rounded-full font-medium shadow-sm border border-slate-200 transition-all hover:shadow-md disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Schedule'}
          </button>
          <p className="text-slate-400 text-xs mt-4">
            Auto-refreshes every 5 minutes
          </p>
        </div>
      </div>
    </main>
  );
}
