import type { ReactNode } from "react";
export default function KpiCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-line bg-white p-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
        {icon}
      </div>
      <div>
        <span className="text-xs text-slate-500">{label}</span>
        <div className="mt-1 text-2xl font-extrabold">{value}</div>
        <span className="text-[11px] text-slate-400">{hint}</span>
      </div>
    </div>
  );
}
