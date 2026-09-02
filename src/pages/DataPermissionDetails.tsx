import {
  ArrowLeft,
  CheckCircle2,
  Database,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import {
  useActivateDataPermission,
  useDataPermission,
  useDeactivateDataPermission,
} from "../hooks/useDataPermissions";
export default function DataPermissionDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const policyId = Number(id);
  const policy = useDataPermission(policyId);
  const activateMutation = useActivateDataPermission();
  const deactivateMutation = useDeactivateDataPermission();
  if (policy.isPending) {
    return <Loading text="Loading data permission..." />;
  }
  if (policy.isError) {
    return <ErrorState error={policy.error} onRetry={policy.refetch} />;
  }
  const data = policy.data;
  if (!data) {
    return null;
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dataPermissions")}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold">Data Permission Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage data access policy information.
            </p>
          </div>
        </div>
      </div>
      <section className="panel p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
            <Database size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold">{data.policyName}</h3>
            <p className="mt-1 text-sm text-slate-500">{data.policyType}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={data.status} />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                <Shield size={12} />
                {data.roleName}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                <Users size={12} />
                {data.scopes.length} Scopes
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <InfoCard title="Policy Information">
          <InfoRow label="Policy Name" value={data.policyName} />
          <InfoRow label="Policy Type" value={data.policyType} />
          <InfoRow label="Policy ID" value={String(data.id)} />
        </InfoCard>
        <InfoCard title="Organization & Role">
          <InfoRow label="Organization" value={data.organization} />
          <InfoRow
            label="Organization ID"
            value={String(data.organizationId)}
          />
          <InfoRow label="Role" value={data.roleName} />
          <InfoRow label="Role ID" value={String(data.roleId)} />
        </InfoCard>
        <InfoCard title="Data Scope">
          <div className="py-4">
            <span className="block text-xs text-slate-400">Enabled Scopes</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.scopes.map((scope) => (
                <span
                  key={scope}
                  className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-bold text-blue-700"
                >
                  {formatValue(scope)}
                </span>
              ))}
            </div>
          </div>
          {data.department && (
            <InfoRow label="Department" value={data.department} />
          )}
          {data.businessUnit && (
            <InfoRow label="Business Unit" value={data.businessUnit} />
          )}
          {data.branch && <InfoRow label="Branch" value={data.branch} />}
          {data.project && <InfoRow label="Project" value={data.project} />}
          {data.location && <InfoRow label="Location" value={data.location} />}
        </InfoCard>
        <InfoCard title="Record Ownership">
          <div className="py-4">
            <span className="block text-xs text-slate-400">
              Ownership Rules
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.ownershipRules.map((rule) => (
                <span
                  key={rule}
                  className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700"
                >
                  {formatValue(rule)}
                </span>
              ))}
            </div>
          </div>
        </InfoCard>
        <InfoCard title="Manager Access">
          <InfoRow
            label="View Subordinate Records"
            value={data.viewSubordinateRecords ? "Allowed" : "Not Allowed"}
          />
          <InfoRow
            label="Approve Subordinate Transactions"
            value={
              data.approveSubordinateTransactions ? "Allowed" : "Not Allowed"
            }
          />
        </InfoCard>
        <InfoCard title="Data Access Preview">
          <InfoRow
            label="Accessible Records"
            value={data.accessibleRecords.toLocaleString()}
          />
          <InfoRow
            label="Restricted Records"
            value={data.restrictedRecords.toLocaleString()}
          />
          <InfoRow
            label="Total Records"
            value={(
              data.accessibleRecords + data.restrictedRecords
            ).toLocaleString()}
          />
        </InfoCard>
        <InfoCard title="Activity">
          <InfoRow label="Created By" value={data.createdBy} />
          <InfoRow label="Created" value={data.createdAt} />
          <InfoRow label="Last Modified" value={data.lastModified} />
        </InfoCard>
      </div>
      <section className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-extrabold">Policy Status</h3>
          <p className="mt-1 text-xs text-slate-400">
            Enable or disable this data access policy.
          </p>
        </div>
        {data.status === "ACTIVE" ? (
          <button
            type="button"
            disabled={deactivateMutation.isPending}
            onClick={async () => {
              await deactivateMutation.mutateAsync(data.id);
              policy.refetch();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle size={15} />
            Deactivate Policy
          </button>
        ) : (
          <button
            type="button"
            disabled={activateMutation.isPending}
            onClick={async () => {
              await activateMutation.mutateAsync(data.id);
              policy.refetch();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
          >
            <CheckCircle2 size={15} />
            Activate Policy
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
function formatValue(value: string) {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
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
