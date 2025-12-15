import { CleaningEvent } from '@/lib/types';
import { getDayLabel } from '@/lib/utils';

interface CleaningCardProps {
  cleaning: CleaningEvent;
}

export function CleaningCard({ cleaning }: CleaningCardProps) {
  const { isToday, isTomorrow, hasGapAfter, gapDays, daysFromNow } = cleaning;

  const cardClasses = isToday
    ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-300'
    : isTomorrow
    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200'
    : 'bg-slate-50 border border-slate-100';

  const dateBoxClasses = isToday
    ? 'bg-teal-500 text-white'
    : isTomorrow
    ? 'bg-blue-500 text-white'
    : 'bg-white text-slate-600 border border-slate-200';

  const textClasses = isToday || isTomorrow ? 'text-slate-900' : 'text-slate-700';

  return (
    <div className={`relative rounded-xl p-2.5 transition-all ${cardClasses}`}>
      <div className="flex items-center justify-between">
        {/* Left side: date box and info */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${dateBoxClasses}`}
          >
            {cleaning.date.getDate()}
          </div>
          <div>
            <p className={`text-xs font-semibold capitalize ${textClasses}`}>
              {cleaning.formattedDate}
            </p>
            <p className="text-slate-500 text-[10px]">{cleaning.formattedTime}</p>
          </div>
        </div>

        {/* Right side: badges */}
        <div className="flex items-center gap-1.5">
          {hasGapAfter && (
            <div className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-0.5">
              <span>⚠️</span>
              <span>{gapDays}d</span>
            </div>
          )}
          {isToday && (
            <span className="bg-teal-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              Hoy
            </span>
          )}
          {isTomorrow && (
            <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              Mañana
            </span>
          )}
          {!isToday && !isTomorrow && daysFromNow < 7 && (
            <span className="text-slate-400 text-[10px]">
              {getDayLabel(daysFromNow)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

