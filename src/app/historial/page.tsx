'use client';

import Link from 'next/link';
import { usePastCleanings } from '@/hooks/usePastCleanings';
import { LoadingSpinner } from '@/components';

export default function HistorialPage() {
  const { periods, loading, error } = usePastCleanings();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Filter out periods with no cleanings for cleaner display
  const periodsWithCleanings = periods.filter(p => p.cleanings.length > 0);

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
            Historial del último año
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

        {/* No past cleanings */}
        {!error && periodsWithCleanings.length === 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md shadow-slate-100 border border-white text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">
              No hay limpiezas anteriores registradas
            </p>
          </div>
        )}

        {/* Periods with cleanings */}
        {periodsWithCleanings.map((period, periodIndex) => (
          <div
            key={periodIndex}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md shadow-slate-100 border border-white"
          >
            {/* Period header */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800">
                {period.label}
              </h2>
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-medium">
                {period.cleanings.length} limpieza{period.cleanings.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Cleanings in this period */}
            <div className="space-y-2">
              {period.cleanings.map((cleaning, cleaningIndex) => (
                <div
                  key={cleaningIndex}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white text-slate-600 border border-slate-200 flex items-center justify-center font-bold text-xs">
                      {cleaning.date.getDate()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 capitalize">
                        {cleaning.formattedDate}
                      </p>
                      <p className="text-slate-500 text-[10px]">
                        {cleaning.formattedTime}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* All periods (including empty ones) - collapsible summary */}
        {periodsWithCleanings.length > 0 && (
          <details className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200 overflow-hidden">
            <summary className="px-4 py-3 cursor-pointer text-xs text-slate-500 hover:text-slate-700 transition-colors">
              Ver todos los períodos ({periods.length} períodos)
            </summary>
            <div className="px-4 pb-4 space-y-1">
              {periods.map((period, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                >
                  <span className="text-[10px] text-slate-600">
                    {period.label}
                  </span>
                  <span
                    className={`text-[10px] font-medium ${
                      period.cleanings.length > 0
                        ? 'text-amber-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {period.cleanings.length} limpieza{period.cleanings.length !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}

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

