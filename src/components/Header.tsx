interface HeaderProps {
  lastUpdated: string | null;
  listingLabels?: string[];
}

export function Header({ lastUpdated, listingLabels }: HeaderProps) {
  const sortedLabels =
    listingLabels && listingLabels.length > 0
      ? [...listingLabels].sort((a, b) => a.localeCompare(b, 'es'))
      : [];

  const listingsSubtitle =
    sortedLabels.length > 1
      ? `${sortedLabels.length} alojamientos • ${sortedLabels.join(' · ')}`
      : sortedLabels.length === 1
        ? sortedLabels[0]
        : null;

  return (
    <header className="pt-6 pb-4 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center px-4 gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-md shadow-teal-200">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-slate-500 text-[10px] leading-relaxed">
              Calendario de limpiezas para Ana.
              {listingsSubtitle && (
                <>
                  <br />
                  <span className="font-semibold text-slate-700">
                    {listingsSubtitle}
                  </span>
                </>
              )}
              <br />
              Actualizado hoy, a las {lastUpdated || 'ahora'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

