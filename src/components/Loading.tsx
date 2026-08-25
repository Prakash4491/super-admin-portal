export default function Loading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="grid min-h-[180px] place-items-center rounded-2xl border border-line bg-white">
      <div className="flex flex-col items-center gap-3 text-xs text-slate-500">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
        {text}
      </div>
    </div>
  );
}
