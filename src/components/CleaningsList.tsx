import { CleaningEvent } from '@/lib/types';
import { CleaningCard } from './CleaningCard';

interface CleaningsListProps {
  cleanings: CleaningEvent[];
}

export function CleaningsList({ cleanings }: CleaningsListProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-md shadow-slate-100 border border-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-slate-800">Próximas Limpiezas</h2>
        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-medium">
          Siguientes 10
        </span>
      </div>

      {/* List or empty state */}
      {cleanings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {cleanings.map((cleaning, index) => (
            <CleaningCard key={index} cleaning={cleaning} />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-6">
      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center">
        <svg
          className="w-5 h-5 text-slate-400"
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
      <p className="text-slate-500 text-xs">No hay más limpiezas programadas</p>
    </div>
  );
}

