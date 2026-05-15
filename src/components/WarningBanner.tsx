interface WarningBannerProps {
  messages: string[];
}

export function WarningBanner({ messages }: WarningBannerProps) {
  if (messages.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-2.5 shadow-sm shadow-amber-100/80">
      <div className="flex gap-2">
        <div className="mt-0.5 shrink-0">
          <svg
            className="h-4 w-4 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold text-amber-950">
            Parte del calendario no se pudo cargar
          </p>
          <ul className="list-disc space-y-0.5 pl-3 text-[10px] leading-snug text-amber-900/90">
            {messages.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
