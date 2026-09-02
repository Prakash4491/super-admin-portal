import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Power,
  Users,
  Building2,
  HardDrive,
} from "lucide-react";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import {
  useActivateTenant,
  useDeactivateTenant,
  useTenant,
  useTenantStats,
} from "../hooks/useTenants";
export default function TenantDetails() {
  const { id } = useParams();
  const tenantId = Number(id);
  const navigate = useNavigate();
  const tenant = useTenant(tenantId);
  const stats = useTenantStats(tenantId);
  const activate = useActivateTenant();
  const deactivate = useDeactivateTenant();
  if (tenant.isPending || stats.isPending) {
    return <Loading text="Loading tenant details..." />;
  }
  if (tenant.isError) {
    return <ErrorState error={tenant.error} onRetry={tenant.refetch} />;
  }
  const data = tenant.data;
  async function toggleStatus() {
    if (data.status === "ACTIVE") {
      await deactivate.mutateAsync(tenantId);
    } else {
      await activate.mutateAsync(tenantId);
    }
  }
  const isChanging = activate.isPending || deactivate.isPending;
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            to="/tenants"
            className="mb-2 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={13} />
            Back to tenants
          </Link>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {data.name}
          </h2>
          <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono">{data.code}</span>
            <StatusBadge status={data.status} />
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/tenants/${tenantId}/edit`} className="btn btn-secondary">
            <Edit3 size={14} />
            Edit Tenant
          </Link>
          <button
            className={`btn ${
              data.status === "ACTIVE" ? "btn-danger" : "btn-success"
            }`}
            onClick={toggleStatus}
            disabled={isChanging}
          >
            <Power size={14} />
            {isChanging
              ? "Updating..."
              : data.status === "ACTIVE"
                ? "Deactivate Tenant"
                : "Activate Tenant"}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="panel">
          <div className="border-b border-line p-5">
            <h3 className="text-sm font-extrabold">Tenant Information</h3>
          </div>
          <div className="divide-y divide-slate-100 px-5">
            <Detail label="Admin" value={data.adminName} />
            <Detail label="Email" value={data.adminEmail} />
            <Detail label="Phone" value={data.phone || "—"} />
            <Detail label="Created" value={data.createdAt} />
            <Detail label="Plan" value={data.plan} />
            <Detail label="Country" value={data.country} />
            <Detail label="Time Zone" value={data.timeZone} />
          </div>
        </section>
        <section className="panel">
          <div className="border-b border-line p-5">
            <h3 className="text-sm font-extrabold">Statistics</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 p-5">
            <Stat
              icon={<Users size={16} />}
              label="Users"
              value={stats.data?.users ?? 0}
            />
            <Stat
              icon={<Building2 size={16} />}
              label="Organizations"
              value={stats.data?.organizations ?? 0}
            />
            <Stat
              icon={<Users size={16} />}
              label="Active Users"
              value={stats.data?.activeUsers ?? 0}
            />
            <Stat
              icon={<HardDrive size={16} />}
              label="Storage"
              value={`${stats.data?.storage ?? 0}%`}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-5 py-4 text-xs">
      <span className="text-slate-500">{label}</span>
      <strong className="text-right">{value}</strong>
    </div>
  );
}
function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-600">
        {icon}
      </div>
      <span className="mt-4 block text-[11px] text-slate-500">{label}</span>
      <strong className="mt-1 block text-2xl font-extrabold">{value}</strong>
    </div>
  );
}
function StatusBadge({ status }: { status: "ACTIVE" | "INACTIVE" }) {
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
