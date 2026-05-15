import Link from 'next/link';

export function HistoryLink() {
  return (
    <div className="text-center pt-2 pb-4">
      <Link
        href="/historial"
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-white hover:text-slate-800 hover:shadow"
      >
        <svg
          className="h-3.5 w-3.5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Ver limpiezas anteriores
      </Link>
    </div>
  );
}
