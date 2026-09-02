import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Power,
  Search,
  ShieldCheck,
} from "lucide-react";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import PermissionFormModal from "../components/PermissionFormModal";
import {
  useActivatePermission,
  useCreatePermission,
  useDeactivatePermission,
  usePermissions,
  useUpdatePermission,
} from "../hooks/usePermissions";
import type {
  Permission,
  PermissionFormValues,
  PermissionListParams,
  PermissionStatus,
} from "../types";
const PAGE_SIZE = 8;
const defaultParams: PermissionListParams = {
  search: "",
  module: "",
  status: "",
  page: 0,
  size: PAGE_SIZE,
  sortBy: "name",
  sortDir: "asc",
};
const moduleOptions = [
  "Dashboard",
  "Tenants",
  "Organizations",
  "Users",
  "Roles",
  "Permissions",
  "Security",
];
const emptyPermissionForm: PermissionFormValues = {
  name: "",
  description: "",
  module: "",
  status: "ACTIVE",
};
export default function PermissionList() {
  const navigate = useNavigate();
  const [params, setParams] = useState<PermissionListParams>(defaultParams);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );
  const [permissionForm, setPermissionForm] =
    useState<PermissionFormValues>(emptyPermissionForm);
  const permissions = usePermissions(params);
  const createMutation = useCreatePermission();
  const updateMutation = useUpdatePermission();
  const activateMutation = useActivatePermission();
  const deactivateMutation = useDeactivatePermission();
  function handleSearch(value: string) {
    setParams((current) => ({
      ...current,
      search: value,
      page: 0,
    }));
  }
  function handleModuleChange(value: string) {
    setParams((current) => ({
      ...current,
      module: value,
      page: 0,
    }));
  }
  function handleStatusChange(value: PermissionStatus | "") {
    setParams((current) => ({
      ...current,
      status: value,
      page: 0,
    }));
  }
  if (permissions.isPending) {
    return <Loading text="Loading permissions..." />;
  }
  if (permissions.isError) {
    return (
      <ErrorState error={permissions.error} onRetry={permissions.refetch} />
    );
  }
  const data = permissions.data;
  function openCreateForm() {
    setPermissionForm(emptyPermissionForm);
    setEditingPermission(null);
    setShowCreateForm(true);
  }
  function closeForm() {
    setShowCreateForm(false);
    setEditingPermission(null);
    setPermissionForm(emptyPermissionForm);
    createMutation.reset();
    updateMutation.reset();
  }
  function handleCreate(values: PermissionFormValues) {
    createMutation.mutate(values, {
      onSuccess: () => {
        closeForm();
      },
    });
  }
  function openEditForm(permission: Permission) {
    setEditingPermission(permission);
    setPermissionForm({
      name: permission.name,
      description: permission.description,
      module: permission.module,
      status: permission.status,
    });
  }
  function handleUpdate(values: PermissionFormValues) {
    if (!editingPermission) {
      return;
    }
    updateMutation.mutate(
      {
        id: editingPermission.id,
        values,
      },
      {
        onSuccess: () => {
          closeForm();
        },
      },
    );
  }
  return (
    <div className="space-y-6">
      <PermissionFormModal
        open={showCreateForm || Boolean(editingPermission)}
        editing={Boolean(editingPermission)}
        initialValues={permissionForm}
        submitting={createMutation.isPending || updateMutation.isPending}
        error={createMutation.error ?? updateMutation.error}
        onClose={closeForm}
        onSubmit={editingPermission ? handleUpdate : handleCreate}
      />
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-red-500 tracking-tight">
            PERMISSION MANAGEMENT
          </h2>
          <p className="mt-1 text-sm font-extrabold text-black-500">
            Manage platform permissions and access capabilities.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          + Create Permission
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
              type="text"
              value={params.search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search permissions..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <select
            value={params.module}
            onChange={(event) => handleModuleChange(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          >
            <option value="">All Modules</option>
            {moduleOptions.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
          <select
            value={params.status}
            onChange={(event) =>
              handleStatusChange(event.target.value as PermissionStatus | "")
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
                  Permission
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Module
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Roles
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
              {data.content.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <ShieldCheck size={30} className="mx-auto text-slate-300" />
                    <p className="mt-2 text-sm font-bold text-slate-500">
                      No permissions found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                data.content.map((permission) => (
                  <tr key={permission.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                          <ShieldCheck size={17} />
                        </div>
                        <div>
                          <strong className="block text-sm">
                            {permission.name}
                          </strong>
                          <span className="text-xs text-slate-400">
                            Permission ID: {permission.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[280px] px-4 py-4 text-sm text-slate-600">
                      <span className="block truncate">
                        {permission.description}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                        {permission.module}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">{permission.roles}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={permission.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {permission.createdAt}
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="View"
                          onClick={() =>
                            navigate(`/permissions/${permission.id}`)
                          }
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => openEditForm(permission)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Pencil size={15} />
                        </button>
                        {permission.status === "ACTIVE" ? (
                          <button
                            type="button"
                            title="Deactivate"
                            disabled={deactivateMutation.isPending}
                            onClick={() =>
                              deactivateMutation.mutate(permission.id)
                            }
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Power size={15} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Activate"
                            disabled={activateMutation.isPending}
                            onClick={() =>
                              activateMutation.mutate(permission.id)
                            }
                            className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                          >
                            <Power size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
function StatusBadge({ status }: { status: PermissionStatus }) {
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
