import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Pencil,
  Power,
  Shield,
  UserRound,
  XCircle,
} from "lucide-react";

import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

import {
  useActivateUser,
  useCreateUser,
  useDeactivateUser,
  useUpdateUser,
  useUsers,
} from "../hooks/useUsers";

import type {
  User,
  UserFormValues,
  UserListParams,
  UserRole,
  UserStatus,
} from "../types";

import { initialTenants } from "../data/tenants";
import { initialOrganizations } from "../data/organizations";
const PAGE_SIZE = 8;

const defaultParams: UserListParams = {
  search: "",
  tenantId: "",
  organizationId: "",
  status: "",
  role: "",
  page: 0,
  size: PAGE_SIZE,
  sortBy: "name",
  sortDir: "asc",
};
export default function UserList() {
  const [params, setParams] = useState<UserListParams>(defaultParams);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const users = useUsers(params);
  const navigate = useNavigate();
  const activateMutation = useActivateUser();

  const deactivateMutation = useDeactivateUser();
  const emptyUserForm: UserFormValues = {
    tenantId: 0,
    organizationId: 0,
    name: "",
    email: "",
    phone: "",
    role: "USER",
    status: "ACTIVE",
  };

  const [userForm, setUserForm] = useState<UserFormValues>(emptyUserForm);
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
      organizationId: "",
      page: 0,
    }));
  };

  const handleOrganizationChange = (value: string) => {
    setParams((current) => ({
      ...current,
      organizationId: value ? Number(value) : "",
      page: 0,
    }));
  };

  const handleStatusChange = (value: UserStatus | "") => {
    setParams((current) => ({
      ...current,
      status: value,
      page: 0,
    }));
  };

  const handleRoleChange = (value: UserRole | "") => {
    setParams((current) => ({
      ...current,
      role: value,
      page: 0,
    }));
  };

  if (users.isPending) {
    return <Loading text="Loading users..." />;
  }

  if (users.isError) {
    return <ErrorState error={users.error} onRetry={users.refetch} />;
  }

  const data = users.data;
  return (
    <div className="space-y-6">
      {showCreateForm && (
        <UserFormModal
          title="Create User"
          form={userForm}
          setForm={setUserForm}
          loading={createMutation.isPending}
          error={createMutation.error}
          onClose={() => {
            setShowCreateForm(false);
            setUserForm(emptyUserForm);
          }}
          onSubmit={async () => {
            if (
              !userForm.tenantId ||
              !userForm.organizationId ||
              !userForm.name.trim() ||
              !userForm.email.trim()
            ) {
              return;
            }

            try {
              await createMutation.mutateAsync(userForm);

              setShowCreateForm(false);
              setUserForm(emptyUserForm);
            } catch {
              // Error displayed in modal
            }
          }}
        />
      )}
      {editingUser && (
        <UserFormModal
          title="Edit User"
          form={userForm}
          setForm={setUserForm}
          loading={updateMutation.isPending}
          error={updateMutation.error}
          onClose={() => {
            setEditingUser(null);
            setUserForm(emptyUserForm);
          }}
          onSubmit={async () => {
            if (
              !userForm.tenantId ||
              !userForm.organizationId ||
              !userForm.name.trim() ||
              !userForm.email.trim()
            ) {
              return;
            }

            try {
              await updateMutation.mutateAsync({
                id: editingUser.id,
                values: userForm,
              });

              setEditingUser(null);
              setUserForm(emptyUserForm);
            } catch {
              // Error displayed in modal
            }
          }}
        />
      )}
      {/* Heading */}
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-red-500 tracking-tight">
            USER MANAGEMENT
          </h2>

          <p className="mt-1 text-sm font-extrabold text-black-500">
            Manage users across all tenants and organizations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setUserForm(emptyUserForm);
            setShowCreateForm(true);
          }}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          + Create User
        </button>
      </div>
      {/* Filters */}
      <section className="panel p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={params.search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search users..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Tenant */}
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

          {/* Organization */}
          <select
            value={params.organizationId}
            onChange={(event) => handleOrganizationChange(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          >
            <option value="">All Organizations</option>

            {initialOrganizations
              .filter(
                (organization) =>
                  !params.tenantId || organization.tenantId === params.tenantId,
              )
              .map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
          </select>

          {/* Role */}
          <select
            value={params.role}
            onChange={(event) =>
              handleRoleChange(event.target.value as UserRole | "")
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          >
            <option value="">All Roles</option>

            <option value="ADMIN">Admin</option>

            <option value="MANAGER">Manager</option>

            <option value="USER">User</option>
          </select>

          {/* Status */}
          <select
            value={params.status}
            onChange={(event) =>
              handleStatusChange(event.target.value as UserStatus | "")
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
                  User
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Organization
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Tenant
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Role
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Last Login
                </th>

                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.content.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  {/* User */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                        <UserRound size={17} />
                      </div>

                      <div>
                        <strong className="block text-sm">{user.name}</strong>

                        <span className="text-xs text-slate-400">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Organization */}
                  <td className="px-4 py-4 text-sm">{user.organizationName}</td>

                  {/* Tenant */}
                  <td className="px-4 py-4 text-sm">{user.tenantName}</td>

                  {/* Role */}
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                      <Shield size={12} />
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={user.status} />
                  </td>

                  {/* Last login */}
                  <td className="px-4 py-4 text-xs text-slate-500">
                    {user.lastLogin}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-2">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() => navigate(`/users/${user.id}`)}
                        title="View"
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Eye size={14} />
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(user);

                          setUserForm({
                            tenantId: user.tenantId,
                            organizationId: user.organizationId,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            role: user.role,
                            status: user.status,
                          });
                        }}
                        title="Edit"
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil size={15} />
                      </button>

                      {/* Activate / Deactivate */}
                      {user.status === "ACTIVE" ? (
                        <button
                          type="button"
                          title="Deactivate"
                          onClick={() => deactivateMutation.mutate(user.id)}
                          disabled={deactivateMutation.isPending}
                          className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                        >
                          <Power size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          title="Activate"
                          onClick={() => activateMutation.mutate(user.id)}
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
function StatusBadge({ status }: { status: UserStatus }) {
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
function UserFormModal({
  title,
  form,
  setForm,
  loading,
  error,
  onClose,
  onSubmit,
}: {
  title: string;
  form: UserFormValues;
  setForm: React.Dispatch<React.SetStateAction<UserFormValues>>;
  loading: boolean;
  error: Error | null;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const organizations = initialOrganizations.filter(
    (organization) => organization.tenantId === form.tenantId,
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-extrabold">{title}</h3>

            <p className="mt-1 text-xs text-slate-400">
              Manage user information.
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

        {/* Form */}

        <div className="space-y-4 p-5">
          {/* Tenant */}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Tenant
            </label>

            <select
              value={form.tenantId}
              onChange={(event) => {
                const tenantId = Number(event.target.value);

                setForm((current) => ({
                  ...current,
                  tenantId,
                  organizationId: 0,
                }));
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value={0}>Select Tenant</option>

              {initialTenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>

          {/* Organization */}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Organization
            </label>

            <select
              value={form.organizationId}
              disabled={!form.tenantId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  organizationId: Number(event.target.value),
                }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-100 focus:border-blue-500"
            >
              <option value={0}>Select Organization</option>

              {organizations.map((organization) => (
                <option key={organization.id} value={organization.id}>
                  {organization.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Full Name
            </label>

            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Enter full name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Email */}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="Enter email"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Phone */}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Phone
            </label>

            <input
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              placeholder="Enter phone number"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Role */}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Role
            </label>

            <select
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as UserRole,
                }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="USER">User</option>

              <option value="MANAGER">Manager</option>

              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Status */}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Status
            </label>

            <select
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as UserStatus,
                }))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="ACTIVE">Active</option>

              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
              {error.message}
            </div>
          )}
        </div>

        {/* Footer */}

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
            {loading ? "Saving..." : "Save User"}
          </button>
        </div>
      </div>
    </div>
  );
}
