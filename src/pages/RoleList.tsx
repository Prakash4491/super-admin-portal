import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Power,
  Search,
  Shield,
} from "lucide-react";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import RoleFormModal from "../components/RoleFormModal";
import {
  useActivateRole,
  useCreateRole,
  useDeactivateRole,
  useRoles,
  useUpdateRole,
} from "../hooks/useRoles";
import type {
  Role,
  RoleFormValues,
  RoleListParams,
  RoleStatus,
} from "../types";
import { initialTenants } from "../data/tenants";
const PAGE_SIZE = 8;
const defaultParams: RoleListParams = {
  search: "",
  tenantId: "",
  status: "",
  page: 0,
  size: PAGE_SIZE,
  sortBy: "name",
  sortDir: "asc",
};
export default function RoleList() {
  const navigate = useNavigate();
  const [params, setParams] = useState<RoleListParams>(defaultParams);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const emptyRoleForm: RoleFormValues = {
    name: "",
    description: "",
    tenantId: 0,
    status: "ACTIVE",
  };
  const [roleForm, setRoleForm] = useState<RoleFormValues>(emptyRoleForm);
  const roles = useRoles(params);
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const activateMutation = useActivateRole();
  const deactivateMutation = useDeactivateRole();
  const handleSearch = (value: string) => {
    setParams((current) => ({
      ...current,
      search: value,
      page: 0,
    }));
  };
  const handleTenantChange = (value: string) => {
    setParams((current) => ({
      ...current,
      tenantId: value ? Number(value) : "",
      page: 0,
    }));
  };
  const handleStatusChange = (value: RoleStatus | "") => {
    setParams((current) => ({
      ...current,
      status: value,
      page: 0,
    }));
  };
  if (roles.isPending) {
    return <Loading text="Loading roles..." />;
  }
  if (roles.isError) {
    return <ErrorState error={roles.error} onRetry={roles.refetch} />;
  }
  const data = roles.data;
  return (
    <div className="space-y-6">
      {showCreateForm && (
        <RoleFormModal
          open={showCreateForm}
          editing={false}
          initialValues={roleForm}
          tenantOptions={initialTenants}
          submitting={createMutation.isPending}
          error={createMutation.error}
          onClose={() => {
            setShowCreateForm(false);
            setRoleForm(emptyRoleForm);
          }}
          onSubmit={(values) => {
            setRoleForm(values);
            createMutation.mutate(values, {
              onSuccess: () => {
                setShowCreateForm(false);
                setRoleForm(emptyRoleForm);
              },
            });
          }}
        />
      )}
      {editingRole && (
        <RoleFormModal
          open={true}
          editing={true}
          initialValues={roleForm}
          tenantOptions={initialTenants}
          submitting={updateMutation.isPending}
          error={updateMutation.error}
          onClose={() => {
            setEditingRole(null);
            setRoleForm(emptyRoleForm);
          }}
          onSubmit={(values) => {
            updateMutation.mutate({
              id: editingRole.id,
              values,
            });
          }}
        />
      )}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-red-500 tracking-tight">
            ROLE MANAGEMENT
          </h2>
          <p className="mt-1 text-sm font-extrabold text-black-500">
            Manage roles and access levels across all tenants.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRoleForm(emptyRoleForm);
            setShowCreateForm(true);
          }}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          + Create Role
        </button>
      </div>
      <section className="panel p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={params.search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search roles..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <select
            value={params.tenantId}
            onChange={(event) => handleTenantChange(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          >
            <option value="">All Tenants</option>
            {initialTenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
          <select
            value={params.status}
            onChange={(event) =>
              handleStatusChange(event.target.value as RoleStatus | "")
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Tenant
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Permissions
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Users
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.content.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                        <Shield size={17} />
                      </div>
                      <div>
                        <strong className="block text-sm">{role.name}</strong>
                        <span className="text-xs text-slate-400">
                          Role ID: {role.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[250px] px-4 py-4 text-sm text-slate-600">
                    <span className="block truncate">{role.description}</span>
                  </td>
                  <td className="px-4 py-4 text-sm">{role.tenantName}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                      {role.permissions}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">{role.users}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={role.status} />
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {role.createdAt}
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/roles/${role.id}`)}
                        title="View"
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => {
                          setEditingRole(role);
                          setRoleForm({
                            name: role.name,
                            description: role.description,
                            tenantId: role.tenantId,
                            status: role.status,
                          });
                        }}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil size={15} />
                      </button>
                      {role.status === "ACTIVE" ? (
                        <button
                          type="button"
                          title="Deactivate"
                          onClick={() => deactivateMutation.mutate(role.id)}
                          disabled={deactivateMutation.isPending}
                          className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                        >
                          <Power size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          title="Activate"
                          onClick={() => activateMutation.mutate(role.id)}
                          disabled={activateMutation.isPending}
                          className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Power size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">
            Showing{" "}
            {data.totalElements === 0 ? 0 : params.page * params.size + 1}–
            {Math.min((params.page + 1) * params.size, data.totalElements)} of{" "}
            {data.totalElements}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={params.page === 0}
              onClick={() =>
                setParams((current) => ({
                  ...current,
                  page: current.page - 1,
                }))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40"
            >
              <ChevronLeft size={15} />
              Previous
            </button>
            <span className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white">
              {params.page + 1}
            </span>
            <button
              type="button"
              disabled={params.page >= data.totalPages - 1}
              onClick={() =>
                setParams((current) => ({
                  ...current,
                  page: current.page + 1,
                }))
              }
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold disabled:opacity-40"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
function StatusBadge({ status }: { status: RoleStatus }) {
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
