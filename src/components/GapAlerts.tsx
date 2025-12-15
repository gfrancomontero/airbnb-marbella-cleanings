import { CleaningEvent } from '@/lib/types';
import { formatGapDate } from '@/lib/utils';

interface GapAlertsProps {
  alerts: CleaningEvent[];
}

export function GapAlerts({ alerts }: GapAlertsProps) {
  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-pulse">
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-amber-900 font-bold text-xs">
            ⚠️ Posibles Reservas de Última Hora
          </h2>
          <p className="text-amber-700 text-[10px]">
            ¡Atención - huecos en el calendario!
          </p>
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div key={index} className="bg-white/60 rounded-lg px-3 py-2">
            <p className="text-slate-800 text-xs font-medium">
              {alert.formattedDate}
            </p>
            <p className="text-amber-600 text-[10px] font-semibold">
              {alert.gapDays} noche{alert.gapDays > 1 ? 's' : ''} libre →
              ¡posible limpieza extra el {formatGapDate(alert.date, alert.gapDays)}!
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

