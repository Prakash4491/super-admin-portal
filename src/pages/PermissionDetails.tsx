import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import {
  useActivatePermission,
  useDeactivatePermission,
  usePermission,
} from "../hooks/usePermissions";
export default function PermissionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const permissionId = Number(id);
  const permission = usePermission(permissionId);
  const activateMutation = useActivatePermission();
  const deactivateMutation = useDeactivatePermission();
  if (permission.isPending) {
    return <Loading text="Loading permission..." />;
  }
  if (permission.isError) {
    return <ErrorState error={permission.error} onRetry={permission.refetch} />;
  }
  const data = permission.data;
  if (!data) {
    return null;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/permissions")}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold">Permission Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage permission information.
            </p>
          </div>
        </div>
      </div>
      <section className="panel p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
            <KeyRound size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold">{data.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{data.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={data.status} />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                <Shield size={12} />
                {data.module}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                <Users size={12} />
                {data.roles} Roles
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <InfoCard title="Permission Information">
          <InfoRow label="Permission Name" value={data.name} />
          <InfoRow label="Description" value={data.description} />
          <InfoRow label="Module" value={data.module} />
        </InfoCard>
        <InfoCard title="Access Information">
          <InfoRow label="Assigned Roles" value={String(data.roles)} />
          <InfoRow label="Status" value={data.status} />
          <InfoRow label="Permission ID" value={String(data.id)} />
        </InfoCard>
        <InfoCard title="Activity">
          <InfoRow label="Created" value={data.createdAt} />
          <InfoRow label="Permission ID" value={String(data.id)} />
        </InfoCard>
        <InfoCard title="Module">
          <InfoRow label="Module Name" value={data.module} />
          <InfoRow label="Permission" value={data.name} />
        </InfoCard>
      </div>
      <section className="panel">
        <div className="border-b border-slate-200 p-5">
          <h3 className="text-sm font-extrabold">Role Usage</h3>
          <p className="mt-1 text-xs text-slate-400">
            Roles currently using this permission.
          </p>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <Users size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block text-xl font-extrabold">
                {data.roles}
              </strong>
              <span className="text-xs text-slate-400">
                {data.roles === 1 ? "Assigned role" : "Assigned roles"}
              </span>
              {data.roleNames?.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.roleNames.map((roleName) => (
                    <span
                      key={roleName}
                      className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-700"
                    >
                      <Shield size={12} />
                      {roleName}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate-400">
                  No roles are currently using this permission.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-extrabold">Permission Status</h3>
          <p className="mt-1 text-xs text-slate-400">
            Enable or disable this permission.
          </p>
        </div>
        {data.status === "ACTIVE" ? (
          <button
            type="button"
            disabled={deactivateMutation.isPending}
            onClick={async () => {
              await deactivateMutation.mutateAsync(data.id);
              permission.refetch();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle size={15} />
            Deactivate Permission
          </button>
        ) : (
          <button
            type="button"
            disabled={activateMutation.isPending}
            onClick={async () => {
              await activateMutation.mutateAsync(data.id);
              permission.refetch();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
          >
            <CheckCircle2 size={15} />
            Activate Permission
          </button>
        )}
      </section>
    </div>
  );
}
function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-sm font-extrabold">{title}</h3>
      </div>
      <div className="divide-y divide-slate-100 px-5">{children}</div>
    </section>
  );
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <span className="text-xs text-slate-400">{label}</span>
      <strong className="text-right text-sm">{value}</strong>
    </div>
  );
}
function StatusBadge({ status }: { status: string }) {
  const active = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-red-500"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
