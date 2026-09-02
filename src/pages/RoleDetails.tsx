import { useState } from "react";
import { ArrowLeft, CheckCircle2, Shield, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import {
  useActivateRole,
  useDeactivateRole,
  useRole,
  useUpdateRolePermissions,
} from "../hooks/useRoles";
import { usePermissions } from "../hooks/usePermissions";
export default function RoleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const roleId = Number(id);
  const role = useRole(roleId);
  const activateMutation = useActivateRole();
  const deactivateMutation = useDeactivateRole();
  const permissions = usePermissions({
    search: "",
    module: "",
    status: "",
    page: 0,
    size: 100,
    sortBy: "name",
    sortDir: "asc",
  });
  const updatePermissions = useUpdateRolePermissions();
  if (role.isPending) {
    return <Loading text="Loading role..." />;
  }
  if (role.isError) {
    return <ErrorState error={role.error} onRetry={role.refetch} />;
  }
  const data = role.data;
  if (!data) {
    return null;
  }
  return (
    <RoleDetailsContent
      data={data}
      permissions={permissions}
      updatePermissions={updatePermissions}
      activateMutation={activateMutation}
      deactivateMutation={deactivateMutation}
      onBack={() => navigate("/roles")}
      onRefresh={role.refetch}
    />
  );
}
function RoleDetailsContent({
  data,
  permissions,
  updatePermissions,
  activateMutation,
  deactivateMutation,
  onBack,
  onRefresh,
}: {
  data: any;
  permissions: ReturnType<typeof usePermissions>;
  updatePermissions: ReturnType<typeof useUpdateRolePermissions>;
  activateMutation: ReturnType<typeof useActivateRole>;
  deactivateMutation: ReturnType<typeof useDeactivateRole>;
  onBack: () => void;
  onRefresh: () => void;
}) {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    data.permissionIds ?? [],
  );
  function togglePermission(permissionId: number) {
    setSelectedPermissions((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  }
  function handleSavePermissions() {
    updatePermissions.mutate(
      {
        roleId: data.id,
        permissionIds: selectedPermissions,
      },
      {
        onSuccess: () => {
          onRefresh();
        },
      },
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold">Role Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage role information.
            </p>
          </div>
        </div>
      </div>
      <section className="panel p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
            <Shield size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold">{data.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{data.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={data.status} />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                <Shield size={12} />
                {selectedPermissions.length} Permissions
              </span>
            </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <InfoCard title="Role Information">
          <InfoRow label="Role Name" value={data.name} />
          <InfoRow label="Description" value={data.description} />
          <InfoRow label="Tenant" value={data.tenantName} />
        </InfoCard>
        <InfoCard title="Access Information">
          <InfoRow
            label="Permissions"
            value={String(selectedPermissions.length)}
          />
          <InfoRow label="Users" value={String(data.users)} />
          <InfoRow label="Status" value={data.status} />
        </InfoCard>
        <InfoCard title="Activity">
          <InfoRow label="Created" value={data.createdAt} />
          <InfoRow label="Role ID" value={String(data.id)} />
        </InfoCard>
        <InfoCard title="Tenant">
          <InfoRow label="Tenant ID" value={String(data.tenantId)} />
          <InfoRow label="Tenant Name" value={data.tenantName} />
        </InfoCard>
      </div>
      <section className="panel">
        <div className="border-b border-slate-200 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-extrabold">Role Permissions</h3>
              <p className="mt-1 text-xs text-slate-400">
                Select the permissions assigned to this role.
              </p>
            </div>
            <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700">
              {selectedPermissions.length} selected
            </span>
          </div>
        </div>
        {permissions.isPending ? (
          <Loading />
        ) : permissions.isError ? (
          <ErrorState error={permissions.error} onRetry={permissions.refetch} />
        ) : permissions.data.content.length === 0 ? (
          <div className="p-8 text-center">
            <Shield size={30} className="mx-auto text-slate-300" />
            <p className="mt-2 text-sm font-bold text-slate-500">
              No permissions available
            </p>
          </div>
        ) : (
          <div className="p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {permissions.data.content.map((permission) => {
                const selected = selectedPermissions.includes(permission.id);
                return (
                  <label
                    key={permission.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                      selected
                        ? "border-blue-300 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => togglePermission(permission.id)}
                      className="mt-1 h-4 w-4"
                    />
                    <div className="min-w-0">
                      <strong className="block text-xs">
                        {permission.name}
                      </strong>
                      <span className="mt-1 block text-[11px] text-slate-400">
                        {permission.description}
                      </span>
                      <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                        {permission.module}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                disabled={updatePermissions.isPending}
                onClick={handleSavePermissions}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {updatePermissions.isPending ? "Saving..." : "Save Permissions"}
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-extrabold">Role Status</h3>
          <p className="mt-1 text-xs text-slate-400">
            Enable or disable this role.
          </p>
        </div>
        {data.status === "ACTIVE" ? (
          <button
            type="button"
            disabled={deactivateMutation.isPending}
            onClick={async () => {
              await deactivateMutation.mutateAsync(data.id);
              onRefresh();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle size={15} />
            Deactivate Role
          </button>
        ) : (
          <button
            type="button"
            disabled={activateMutation.isPending}
            onClick={async () => {
              await activateMutation.mutateAsync(data.id);
              onRefresh();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
          >
            <CheckCircle2 size={15} />
            Activate Role
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
