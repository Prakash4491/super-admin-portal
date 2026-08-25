interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  const message = error instanceof Error ? error.message : "Something went wrong.";

  return (
    <div className="grid min-h-[180px] place-items-center rounded-2xl border border-red-100 bg-white p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <strong className="text-sm text-red-700">Unable to load data</strong>
        <span className="text-xs text-slate-500">{message}</span>
        {onRetry && (
          <button className="btn btn-secondary" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
