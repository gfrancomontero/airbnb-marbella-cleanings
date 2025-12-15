'use client';

import Link from 'next/link';
import { usePastCleanings } from '@/hooks/usePastCleanings';
import { LoadingSpinner } from '@/components';

export default function HistorialPage() {
  const { periods, loading, error } = usePastCleanings();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Count total past cleanings
  const totalCleanings = periods.reduce((sum, p) => sum + p.cleanings.length, 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      {/* Header */}
      <header className="pt-6 pb-4 px-4">
        <div className="max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 text-xs mb-3 transition-colors"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Limpiezas Anteriores
            </h1>
          </div>
          <p className="text-slate-500 text-[10px]">
            Historial del último año • {totalCleanings} limpieza{totalCleanings !== 1 ? 's' : ''} registrada{totalCleanings !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 pb-8 space-y-4">
        {/* Error state */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
            <p className="text-rose-800 text-xs font-medium">{error}</p>
          </div>
        )}

        {/* Info message when no past cleanings */}
        {!error && totalCleanings === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-amber-800 text-xs font-medium mb-1">
              Aún no hay limpiezas anteriores
            </p>
            <p className="text-amber-600 text-[10px]">
              El calendario de Airbnb solo muestra reservas futuras.
              <br />
              Las limpiezas aparecerán aquí cuando terminen las reservas.
            </p>
          </div>
        )}

        {/* All periods */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md shadow-slate-100 border border-white">
          <h2 className="text-sm font-bold text-slate-800 mb-3">
            Períodos del último año
          </h2>
          <div className="space-y-2">
            {periods.map((period, index) => (
              <div key={index}>
                {/* Period header */}
                <div
                  className={`rounded-xl p-3 ${
                    period.cleanings.length > 0
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-slate-50 border border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${
                        period.cleanings.length > 0
                          ? 'text-amber-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {period.label}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        period.cleanings.length > 0
                          ? 'bg-amber-200 text-amber-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {period.cleanings.length} limpieza{period.cleanings.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Cleanings in this period */}
                  {period.cleanings.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {period.cleanings.map((cleaning, cleaningIndex) => (
                        <div
                          key={cleaningIndex}
                          className="bg-white rounded-lg p-2 flex items-center gap-2"
                        >
                          <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px]">
                            {cleaning.date.getDate()}
                          </div>
                          <div>
                            <p className="text-[10px] font-medium text-slate-700 capitalize">
                              {cleaning.formattedDate}
                            </p>
                            <p className="text-[9px] text-slate-400">
                              {cleaning.formattedTime}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back button */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 bg-white/80 hover:bg-white text-slate-600 px-4 py-2 rounded-full text-xs font-medium shadow-sm border border-slate-200 transition-all hover:shadow-md"
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
