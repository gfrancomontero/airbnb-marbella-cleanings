interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
        <svg
          className="w-3.5 h-3.5 text-rose-500"
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
        <p className="text-rose-800 text-xs font-medium">{message}</p>
        <button
          onClick={onRetry}
          className="text-rose-600 text-[10px] hover:underline"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}

