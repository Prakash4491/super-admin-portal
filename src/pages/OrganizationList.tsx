import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Eye,
  Power,
  Pencil,
  Search,
  XCircle,
} from "lucide-react";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import {
  useActivateOrganization,
  useCreateOrganization,
  useDeactivateOrganization,
  useOrganizations,
  useUpdateOrganization,
} from "../hooks/useOrganizations";
import type {
  Organization,
  OrganizationFormValues,
  OrganizationListParams,
  OrganizationStatus,
} from "../types";
import { initialTenants } from "../data/tenants";
const PAGE_SIZE = 8;
const defaultParams: OrganizationListParams = {
  search: "",
  status: "",
  tenantId: "",
  page: 0,
  size: PAGE_SIZE,
  sortBy: "name",
  sortDir: "asc",
};
export default function OrganizationList() {
  const navigate = useNavigate();
  const [params, setParams] = useState<OrganizationListParams>(defaultParams);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({
    tenantId: "",
    name: "",
    code: "",
    description: "",
    status: "ACTIVE" as OrganizationStatus,
  });
  const createMutation = useCreateOrganization();
  const organizations = useOrganizations(params);
  const activateMutation = useActivateOrganization();
  const deactivateMutation = useDeactivateOrganization();
  const updateMutation = useUpdateOrganization();
  const resetPage = () => {
    setParams((current) => ({
      ...current,
      page: 0,
    }));
  };
  const handleSearch = (value: string) => {
    setParams((current) => ({
      ...current,
      search: value,
      page: 0,
    }));
  };
  const handleStatusChange = (value: OrganizationStatus | "") => {
    setParams((current) => ({
      ...current,
      status: value,
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
  const handleSort = (field: OrganizationListParams["sortBy"]) => {
    setParams((current) => ({
      ...current,
      sortBy: field,
      sortDir:
        current.sortBy === field && current.sortDir === "asc" ? "desc" : "asc",
    }));
  };
  if (organizations.isPending) {
    return <Loading text="Loading organizations..." />;
  }
  if (organizations.isError) {
    return (
      <ErrorState error={organizations.error} onRetry={organizations.refetch} />
    );
  }
  const data = organizations.data;
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-red-500 tracking-tight">
            ORGANIZATION MANAGEMENT
          </h2>
          <p className="mt-1 font-extrabold text-sm text-black-500">
            Manage organizations across all tenants.{" "}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm(true)}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          <Plus size={17} />
          Create Organization
        </button>
      </div>
      {showCreateForm && (
        <CreateOrganizationModal
          form={form}
          setForm={setForm}
          loading={createMutation.isPending}
          error={createMutation.error}
          onClose={() => {
            setShowCreateForm(false);
            setForm({
              tenantId: "",
              name: "",
              code: "",
              description: "",
              status: "ACTIVE",
            });
          }}
          onSubmit={async () => {
            if (!form.tenantId || !form.name.trim() || !form.code.trim()) {
              return;
            }
            try {
              await createMutation.mutateAsync({
                tenantId: Number(form.tenantId),
                name: form.name,
                code: form.code,
                description: form.description,
                status: form.status,
              });
              setShowCreateForm(false);
              setForm({
                tenantId: "",
                name: "",
                code: "",
                description: "",
                status: "ACTIVE",
              });
            } catch {}
          }}
        />
      )}
      {editingOrganization && (
        <EditOrganizationModal
          organization={editingOrganization}
          loading={updateMutation.isPending}
          error={updateMutation.error}
          onClose={() => {
            setEditingOrganization(null);
          }}
          onSubmit={async (values) => {
            try {
              await updateMutation.mutateAsync({
                id: editingOrganization.id,
                values,
              });
              setEditingOrganization(null);
            } catch {}
          }}
        />
      )}
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
              placeholder="Search organizations..."
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
              handleStatusChange(event.target.value as OrganizationStatus | "")
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
          <table className="w-full min-w-[850px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeader
                  label="Organization"
                  onClick={() => handleSort("name")}
                />
                <TableHeader
                  label="Tenant"
                  onClick={() => handleSort("tenantName")}
                />
                <TableHeader label="Code" onClick={() => handleSort("code")} />
                <TableHeader
                  label="Users"
                  onClick={() => handleSort("users")}
                />
                <TableHeader
                  label="Status"
                  onClick={() => handleSort("status")}
                />
                <TableHeader
                  label="Created"
                  onClick={() => handleSort("createdAt")}
                />
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.content.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    No organizations found.
                  </td>
                </tr>
              ) : (
                data.content.map((organization) => (
                  <tr key={organization.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                          <Building2 size={17} />
                        </div>
                        <div>
                          <strong className="block text-sm">
                            {organization.name}
                          </strong>
                          <span className="text-xs text-slate-400">
                            {organization.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {organization.tenantName}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold">
                        {organization.code}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {organization.users}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={organization.status} />
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-500">
                      {organization.createdAt}
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/organizations/${organization.id}`)
                          }
                          title="View"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingOrganization(organization)}
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        >
                          <Pencil size={15} />
                        </button>
                        {organization.status === "ACTIVE" ? (
                          <button
                            type="button"
                            title="Deactivate"
                            onClick={() =>
                              deactivateMutation.mutate(organization.id)
                            }
                            disabled={deactivateMutation.isPending}
                            className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                          >
                            <Power size={15} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Activate"
                            onClick={() =>
                              activateMutation.mutate(organization.id)
                            }
                            disabled={activateMutation.isPending}
                            className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50"
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
function TableHeader({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <th className="px-4 py-3 text-left">
      <button
        type="button"
        onClick={onClick}
        className="text-xs font-bold text-slate-500 hover:text-blue-600"
      >
        {label}
      </button>
    </th>
  );
}
function StatusBadge({ status }: { status: OrganizationStatus }) {
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
function CreateOrganizationModal({
  form,
  setForm,
  loading,
  error,
  onClose,
  onSubmit,
}: {
  form: {
    tenantId: string;
    name: string;
    code: string;
    description: string;
    status: OrganizationStatus;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      tenantId: string;
      name: string;
      code: string;
      description: string;
      status: OrganizationStatus;
    }>
  >;
  loading: boolean;
  error: Error | null;
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-extrabold">Create Organization</h3>
            <p className="mt-1 text-xs text-slate-400">
              Add a new organization to a tenant.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Tenant
            </label>
            <select
              value={form.tenantId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  tenantId: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select Tenant</option>
              {initialTenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Organization Name
            </label>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="e.g. Engineering"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Organization Code
            </label>
            <input
              value={form.code}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  code: event.target.value,
                }))
              }
              placeholder="e.g. ACM-ENG"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm uppercase outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Describe the organization..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Status
            </label>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as OrganizationStatus,
                }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
              {error.message}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Organization"}
          </button>
        </div>
      </div>
    </div>
  );
}
function EditOrganizationModal({
  organization,
  loading,
  error,
  onClose,
  onSubmit,
}: {
  organization: Organization;
  loading: boolean;
  error: Error | null;
  onClose: () => void;
  onSubmit: (values: OrganizationFormValues) => void;
}) {
  const [form, setForm] = useState<OrganizationFormValues>({
    tenantId: organization.tenantId,
    name: organization.name,
    code: organization.code,
    description: organization.description,
    status: organization.status,
  });
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-extrabold">Edit Organization</h3>
            <p className="mt-1 text-xs text-slate-400">
              Update organization configuration.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Tenant
            </label>
            <select
              value={form.tenantId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  tenantId: Number(event.target.value),
                }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              {initialTenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Organization Name
            </label>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Organization Code
            </label>
            <input
              value={form.code}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm font-semibold text-slate-500 outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Organization code cannot be changed.
            </p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Status
            </label>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as OrganizationStatus,
                }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
              {error.message}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(form)}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
