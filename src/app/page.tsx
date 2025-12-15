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
      setLastUpdated(new Date().toLocaleTimeString('es-ES'));
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el calendario');
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
  // Skip the first one since it's already shown in the hero card
  const upcomingCleanings = cleanings.slice(1, 11);
  const gapAlerts = cleanings.filter(c => c.hasGapAfter && c.daysFromNow <= 10);

  if (loading && cleanings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-3 border-teal-200"></div>
            <div className="absolute inset-0 rounded-full border-3 border-teal-500 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 text-xs font-medium tracking-wide">Cargando horario...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <header className="pt-6 pb-4 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Limpiezas Marbella
            </h1>
          </div>
          <p className="text-slate-500 text-[10px]">Calendario de limpiezas Airbnb • Actualizado {lastUpdated || 'ahora'}</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-8 space-y-4">
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-rose-800 text-xs font-medium">{error}</p>
              <button onClick={fetchCalendar} className="text-rose-600 text-[10px] hover:underline">
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Gap Alerts */}
        {gapAlerts.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-amber-900 font-bold text-xs">⚠️ Posibles Reservas de Última Hora</h2>
                <p className="text-amber-700 text-[10px]">¡Atención - huecos en el calendario!</p>
              </div>
            </div>
            <div className="space-y-2">
              {gapAlerts.map((alert, index) => (
                <div key={index} className="bg-white/60 rounded-lg px-3 py-2">
                  <p className="text-slate-800 text-xs font-medium">{alert.formattedDate}</p>
                  <p className="text-amber-600 text-[10px] font-semibold">
                    {alert.gapDays} noche{alert.gapDays > 1 ? 's' : ''} libre → ¡posible limpieza extra el {new Date(alert.date.getTime() + alert.gapDays * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}!
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Cleaning - Hero Card */}
        {nextCleaning && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 p-4 text-white shadow-lg shadow-teal-200">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-medium">
                  Próxima Limpieza
                </span>
                {nextCleaning.isToday && (
                  <span className="bg-white text-teal-600 px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                    HOY
                  </span>
                )}
                {nextCleaning.isTomorrow && (
                  <span className="bg-white/90 text-teal-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    MAÑANA
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-bold mb-0.5 tracking-tight capitalize">
                {nextCleaning.formattedDate}
              </h2>
              <p className="text-sm text-white/90 font-medium">
                {nextCleaning.formattedTime}
              </p>
              
              {!nextCleaning.isToday && !nextCleaning.isTomorrow && (
                <p className="mt-2 text-white/70 text-[10px]">
                  {getDayLabel(nextCleaning.daysFromNow)}
                </p>
              )}

              {nextCleaning.hasGapAfter && (
                <div className="mt-3 bg-amber-400/30 backdrop-blur rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
                  <span className="text-sm">⚠️</span>
                  <span className="text-[10px] font-medium">
                    {nextCleaning.gapDays} noche{nextCleaning.gapDays > 1 ? 's' : ''} libre - ¡posible limpieza extra!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Cleanings List */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md shadow-slate-100 border border-white">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-800">Próximas Limpiezas</h2>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
              Siguientes 10
            </span>
          </div>
          
          {upcomingCleanings.length === 0 ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-slate-500 text-xs">No hay más limpiezas programadas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingCleanings.map((cleaning, index) => (
                <div
                  key={index}
                  className={`relative rounded-xl p-2.5 transition-all ${
                    cleaning.isToday
                      ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-300'
                      : cleaning.isTomorrow
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
                      : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        cleaning.isToday
                          ? 'bg-teal-500 text-white'
                          : cleaning.isTomorrow
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}>
                        {cleaning.date.getDate()}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold capitalize ${
                          cleaning.isToday || cleaning.isTomorrow ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {cleaning.formattedDate}
                        </p>
                        <p className="text-slate-500 text-[10px]">{cleaning.formattedTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {cleaning.hasGapAfter && (
                        <div className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5">
                          <span>⚠️</span>
                          <span>{cleaning.gapDays}d</span>
                        </div>
                      )}
                      {cleaning.isToday && (
                        <span className="bg-teal-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Hoy
                        </span>
                      )}
                      {cleaning.isTomorrow && (
                        <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                          Mañana
                        </span>
                      )}
                      {!cleaning.isToday && !cleaning.isTomorrow && cleaning.daysFromNow < 7 && (
                        <span className="text-slate-400 text-[10px]">
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
        <div className="text-center pt-4">
          <button
            onClick={fetchCalendar}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-white/80 hover:bg-white text-slate-600 px-4 py-2 rounded-full text-xs font-medium shadow-sm border border-slate-200 transition-all hover:shadow-md disabled:opacity-50"
          >
            <svg className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          <p className="text-slate-400 text-[9px] mt-2">
            Se actualiza automáticamente cada 5 minutos
          </p>
        </div>
      </div>
    </main>
  );
}
