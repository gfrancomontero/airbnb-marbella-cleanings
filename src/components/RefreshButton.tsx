interface RefreshButtonProps {
  loading: boolean;
  onRefresh: () => void;
}

export function RefreshButton({ loading, onRefresh }: RefreshButtonProps) {
  return (
    <div className="text-center pt-4">
      <button
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center gap-1.5 bg-white/80 hover:bg-white text-slate-600 px-4 py-2 rounded-full text-xs font-medium shadow-sm border border-slate-200 transition-all hover:shadow-md disabled:opacity-50"
      >
        <svg
          className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </button>
      <p className="text-slate-400 text-[9px] mt-2">
        Se actualiza automáticamente cada 5 minutos
      </p>
    </div>
  );
}

