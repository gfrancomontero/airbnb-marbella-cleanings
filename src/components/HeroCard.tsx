import { CleaningEvent } from '@/lib/types';
import { getDayLabel, formatGapDate } from '@/lib/utils';

interface HeroCardProps {
  cleaning: CleaningEvent;
}

export function HeroCard({ cleaning }: HeroCardProps) {
  const isToday = cleaning.isToday;
  const isTomorrow = cleaning.isTomorrow;

  // Different gradient for today - more urgent orange/red tones
  const cardGradient = isToday
    ? 'from-orange-500 via-rose-500 to-pink-500 shadow-orange-200'
    : 'from-teal-500 via-cyan-500 to-blue-500 shadow-teal-200';

  const badgeColors = isToday
    ? 'text-orange-600'
    : 'text-teal-600';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${cardGradient} p-4 text-white shadow-lg`}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        {/* Header badges */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-medium">
            Próxima Limpieza
          </span>
          {isToday && (
            <span className={`bg-white ${badgeColors} px-2 py-0.5 rounded-full text-[10px] font-bold animate-pulse`}>
              ¡HOY!
            </span>
          )}
          {isTomorrow && (
            <span className={`bg-white/90 ${badgeColors} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
              MAÑANA
            </span>
          )}
        </div>

        {/* Today special message */}
        {isToday && (
          <p className="text-white/90 text-xs font-semibold mb-2 animate-pulse">
            🧹 ¡Tienes limpieza hoy! No lo olvides.
          </p>
        )}

        {/* Date and time */}
        <h2 className="text-xl font-bold mb-0.5 tracking-tight capitalize">
          {cleaning.formattedDate}
        </h2>
        <p className="text-sm text-white/90 font-medium">
          {cleaning.formattedTime}
        </p>

        {/* Days from now label */}
        {!isToday && !isTomorrow && (
          <p className="mt-2 text-white/70 text-[10px]">
            {getDayLabel(cleaning.daysFromNow)}
          </p>
        )}

        {/* Gap warning */}
        {cleaning.hasGapAfter && (
          <div className="mt-3 bg-amber-400/30 backdrop-blur rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5">
            <span className="text-sm">⚠️</span>
            <span className="text-[10px] font-medium">
              {cleaning.gapDays} noche{cleaning.gapDays > 1 ? 's' : ''} libre
              entre reservas, el día {formatGapDate(cleaning.date, cleaning.gapDays)}
              <br />
              ¡posible limpieza extra!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

