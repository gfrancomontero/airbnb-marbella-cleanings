export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-14 h-14 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-3 border-teal-200"></div>
          <div className="absolute inset-0 rounded-full border-3 border-teal-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-600 text-xs font-medium tracking-wide">
          Cargando horario...
        </p>
      </div>
    </div>
  );
}

