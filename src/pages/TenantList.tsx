import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import TenantTable from "../components/TenantTable";
import {
  useActivateTenant,
  useDeactivateTenant,
  useTenants
} from "../hooks/useTenants";
import type { Plan, Tenant } from "../types";

const PAGE_SIZE = 8;

export default function TenantList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | "ACTIVE" | "INACTIVE">("");
  const [plan, setPlan] = useState<Plan | "">("");
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState<keyof Tenant>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const query = useTenants({
    search,
    status,
    plan,
    page,
    size: PAGE_SIZE,
    sortBy,
    sortDir
  });

  const activate = useActivateTenant();
  const deactivate = useDeactivateTenant();

  if (query.isPending) return <Loading text="Loading tenants..." />;
  if (query.isError) return <ErrorState error={query.error} onRetry={query.refetch} />;

  function handleSort(field: keyof Tenant) {
    setPage(0);

    if (sortBy === field) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  }

  function resetPage() {
    setPage(0);
  }

  const data = query.data;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Tenant Management</h2>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter and manage all platform tenants.
          </p>
        </div>
        <Link to="/tenants/new" className="btn btn-primary">
          <Plus size={15} />
          Create Tenant
        </Link>
      </div>

      <section className="panel">
        <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 px-3">
            <Search size={15} className="text-slate-400" />
            <input
              className="w-full py-2.5 text-sm outline-none"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
              placeholder="Search tenant name or code..."
            />
          </div>

          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as typeof status);
              resetPage();
            }}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none"
            value={plan}
            onChange={(event) => {
              setPlan(event.target.value as Plan | "");
              resetPage();
            }}
          >
            <option value="">All Plans</option>
            <option value="BASIC">Basic</option>
            <option value="PRO">Pro</option>
            <option value="ENTERPRISE">Enterprise</option>
          </select>
        </div>

        {query.isFetching && (
          <div className="border-b border-slate-100 px-4 py-2 text-[11px] text-slate-400">
            Refreshing tenant data...
          </div>
        )}

        <TenantTable
          tenants={data.content}
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={handleSort}
          onActivate={(id) => activate.mutate(id)}
          onDeactivate={(id) => deactivate.mutate(id)}
          activatingId={activate.isPending ? activate.variables ?? null : null}
          deactivatingId={deactivate.isPending ? deactivate.variables ?? null : null}
        />

        <div className="flex flex-col gap-3 border-t border-line p-4 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {data.content.length} of {data.totalElements} tenants
          </span>

          <div className="flex flex-wrap gap-1">
            <button
              className="rounded-md border border-slate-200 px-2.5 py-1.5 disabled:opacity-40"
              disabled={page === 0}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </button>

            {Array.from({ length: data.totalPages }, (_, index) => (
              <button
                key={index}
                className={`rounded-md border px-2.5 py-1.5 ${
                  index === page
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white"
                }`}
                onClick={() => setPage(index)}
              >
                {index + 1}
              </button>
            ))}

            <button
              className="rounded-md border border-slate-200 px-2.5 py-1.5 disabled:opacity-40"
              disabled={page >= data.totalPages - 1}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
