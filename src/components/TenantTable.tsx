import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, Pencil, Power } from "lucide-react";
import type { Tenant } from "../types";
interface Props {
  tenants: Tenant[];
  sortBy: keyof Tenant;
  sortDir: "asc" | "desc";
  onSort: (field: keyof Tenant) => void;
  onActivate: (id: number) => void;
  onDeactivate: (id: number) => void;
  activatingId: number | null;
  deactivatingId: number | null;
}
export default function TenantTable({
  tenants,
  sortBy,
  sortDir,
  onSort,
  onActivate,
  onDeactivate,
  activatingId,
  deactivatingId,
}: Props) {
  const indicator = (field: keyof Tenant) => {
    if (sortBy !== field) return null;
    return sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse">
        <thead>
          <tr className="bg-slate-50 text-left text-[11px] font-bold text-slate-500">
            {[
              ["name", "Tenant"],
              ["code", "Code"],
              ["adminName", "Admin"],
              ["plan", "Plan"],
              ["users", "Users"],
              ["status", "Status"],
              ["createdAt", "Created"],
            ].map(([field, label]) => (
              <th key={field} className="border-b border-line px-4 py-3">
                <button
                  className="flex items-center gap-1"
                  onClick={() => onSort(field as keyof Tenant)}
                >
                  {label}
                  {indicator(field as keyof Tenant)}
                </button>
              </th>
            ))}
            <th className="border-b border-line px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-slate-50/70">
              <td className="border-b border-slate-100 px-4 py-3.5 text-xs font-bold">
                {tenant.name}
              </td>
              <td className="border-b border-slate-100 px-4 py-3.5 font-mono text-[11px]">
                {tenant.code}
              </td>
              <td className="border-b border-slate-100 px-4 py-3.5 text-xs">
                {tenant.adminName}
              </td>
              <td className="border-b border-slate-100 px-4 py-3.5">
                <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold">
                  {tenant.plan}
                </span>
              </td>
              <td className="border-b border-slate-100 px-4 py-3.5 text-xs">
                {tenant.users}
              </td>
              <td className="border-b border-slate-100 px-4 py-3.5">
                <StatusBadge status={tenant.status} />
              </td>
              <td className="border-b border-slate-100 px-4 py-3.5 text-xs">
                {tenant.createdAt}
              </td>
              <td className="border-b border-slate-100 px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/tenants/${tenant.id}`}
                    title="View"
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Eye size={15} />
                  </Link>
                  <Link
                    to={`/tenants/${tenant.id}/edit`}
                    title="Edit"
                    className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Pencil size={15} />
                  </Link>
                  {tenant.status === "ACTIVE" ? (
                    <button
                      title="Deactivate"
                      disabled={deactivatingId === tenant.id}
                      onClick={() => onDeactivate(tenant.id)}
                      className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Power size={15} />
                    </button>
                  ) : (
                    <button
                      title="Activate"
                      disabled={activatingId === tenant.id}
                      onClick={() => onActivate(tenant.id)}
                      className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50"
                    >
                      <Power size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {tenants.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="px-4 py-14 text-center text-xs text-slate-400"
              >
                No tenants match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function StatusBadge({ status }: { status: Tenant["status"] }) {
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${
        status === "ACTIVE"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}
