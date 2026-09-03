import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Pencil,
  Power,
  Search,
  Shield,
  UserRound,
  X,
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
type UserManagementForm = {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  mobileNumber: string;
  tenantId: number;
  organizationId: number;
  businessUnit: string;
  department: string;
  branch: string;
  username: string;
  role: UserRole;
  reportingManager: string;
  status: UserStatus;
  emailVerified: boolean;
  mobileVerified: boolean;
};
const emptyUserForm: UserManagementForm = {
  firstName: "",
  lastName: "",
  employeeId: "",
  email: "",
  mobileNumber: "",
  tenantId: 0,
  organizationId: 0,
  businessUnit: "",
  department: "",
  branch: "",
  username: "",
  role: "USER",
  reportingManager: "",
  status: "ACTIVE",
  emailVerified: true,
  mobileVerified: true,
};
export default function UserList() {
  const navigate = useNavigate();
  const [params, setParams] = useState<UserListParams>(defaultParams);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<UserManagementForm>(emptyUserForm);
  const users = useUsers(params);
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();
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
  const openCreateForm = () => {
    setUserForm({
      ...emptyUserForm,
      employeeId: `EMP${String(Date.now()).slice(-5)}`,
    });
    setEditingUser(null);
    setShowCreateForm(true);
  };
  const openEditForm = (user: User) => {
    const nameParts = user.name.trim().split(" ");
    const firstName = nameParts.shift() ?? "";
    const lastName = nameParts.join(" ");
    setUserForm({
      firstName,
      lastName,
      employeeId: String(user.id),
      email: user.email,
      mobileNumber: user.phone,
      tenantId: user.tenantId,
      organizationId: user.organizationId,
      businessUnit: "Technology Division",
      department: "Information Technology",
      branch: "Hyderabad",
      username: user.email.split("@")[0],
      role: user.role,
      reportingManager: "Select Employee",
      status: user.status,
      emailVerified: true,
      mobileVerified: true,
    });
    setEditingUser(user);
    setShowCreateForm(false);
  };
  const closeForm = () => {
    setShowCreateForm(false);
    setEditingUser(null);
    setUserForm(emptyUserForm);
  };
  const convertToUserFormValues = (): UserFormValues => {
    return {
      tenantId: userForm.tenantId,
      organizationId: userForm.organizationId,
      name: `${userForm.firstName} ${userForm.lastName}`.trim(),
      email: userForm.email,
      phone: userForm.mobileNumber,
      role: userForm.role,
      status: userForm.status,
    };
  };
  const handleSave = async () => {
    if (
      !userForm.firstName.trim() ||
      !userForm.lastName.trim() ||
      !userForm.email.trim() ||
      !userForm.tenantId ||
      !userForm.organizationId
    ) {
      return;
    }
    try {
      const values = convertToUserFormValues();
      if (editingUser) {
        await updateMutation.mutateAsync({
          id: editingUser.id,
          values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }
      closeForm();
    } catch {}
  };
  const handleExport = () => {
    const data = users.data?.content ?? [];
    const headers = [
      "Employee ID",
      "Name",
      "Email",
      "Organization",
      "Department",
      "Role",
      "Status",
    ];
    const rows = data.map((user) => [
      `EMP${String(user.id).padStart(3, "0")}`,
      user.name,
      user.email,
      user.organizationName,
      "Information Technology",
      formatRole(user.role),
      user.status,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "user-management-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
      {showCreateForm || editingUser ? (
        <UserFormModal
          title={editingUser ? "Update User" : "Create User"}
          form={userForm}
          setForm={setUserForm}
          loading={createMutation.isPending || updateMutation.isPending}
          error={createMutation.error || updateMutation.error}
          onClose={closeForm}
          onSubmit={handleSave}
          editing={Boolean(editingUser)}
        />
      ) : null}
      {}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-red-500">
            USER MANAGEMENT
          </h2>
          <p className="mt-1 text-sm font-extrabold text-black-500">
            Manage users across all tenants and organizations.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          <UserRound size={16} />
          Create User
        </button>
      </section>
      {}
      <section className="panel p-5">
        <SectionTitle title="Search User" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={params.search}
              onChange={(event) => handleSearch(event.target.value)}
              placeholder="Search by employee ID, name, email..."
              className="field-input pl-9"
            />
          </div>
          <button
            type="button"
            className="btn btn-primary w-fit whitespace-nowrap"
            onClick={() => handleSearch(params.search)}
          >
            <Search size={15} />
            Search
          </button>
        </div>
      </section>
      {}
      <section className="panel p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label="Tenant"
            value={params.tenantId}
            onChange={handleTenantChange}
            options={initialTenants.map((tenant) => ({
              value: tenant.id,
              label: tenant.name,
            }))}
          />
          <FilterSelect
            label="Organization"
            value={params.organizationId}
            onChange={handleOrganizationChange}
            options={initialOrganizations
              .filter(
                (organization) =>
                  !params.tenantId || organization.tenantId === params.tenantId,
              )
              .map((organization) => ({
                value: organization.id,
                label: organization.name,
              }))}
          />
          <FilterSelect
            label="Role"
            value={params.role}
            onChange={(value) => handleRoleChange(value as UserRole | "")}
            options={[
              {
                value: "ADMIN",
                label: "Administrator",
              },
              {
                value: "MANAGER",
                label: "Manager",
              },
              {
                value: "USER",
                label: "Executive",
              },
            ]}
          />
          <FilterSelect
            label="Status"
            value={params.status}
            onChange={(value) => handleStatusChange(value as UserStatus | "")}
            options={[
              {
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "INACTIVE",
                label: "Inactive",
              },
            ]}
          />
        </div>
      </section>
      {}
      <section className="panel overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">User List</h3>
            <p className="mt-1 text-xs text-slate-500">
              Manage registered users.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="btn btn-secondary w-fit whitespace-nowrap"
          >
            <Download size={15} />
            Export
          </button>
        </div>
        {}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeader>Employee ID</TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Department</TableHeader>
                <TableHeader>Role</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.content.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                data.content.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 text-sm font-semibold">
                      EMP{String(user.id).padStart(3, "0")}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                          <UserRound size={16} />
                        </div>
                        <div>
                          <strong className="block text-sm">{user.name}</strong>
                          <span className="text-xs text-slate-400">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      Information Technology
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                        <Shield size={12} />
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {}
                        <button
                          type="button"
                          onClick={() => navigate(`/users/${user.id}`)}
                          title="View"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                        >
                          <Eye size={15} />
                        </button>
                        {}
                        <button
                          type="button"
                          onClick={() => openEditForm(user)}
                          title="Edit"
                          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                        >
                          <Pencil size={15} />
                        </button>
                        {}
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
                ))
              )}
            </tbody>
          </table>
        </div>
        {}
        <div className="space-y-3 p-4 md:hidden">
          {data.content.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No users found.
            </div>
          ) : (
            data.content.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                      <UserRound size={17} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        EMP{String(user.id).padStart(3, "0")}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={user.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-400">Department</p>
                    <p className="mt-1 font-semibold text-slate-700">
                      Information Technology
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-400">Role</p>
                    <p className="mt-1 font-semibold text-slate-700">
                      {formatRole(user.role)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-bold text-slate-400">Email</p>
                    <p className="mt-1 break-all font-semibold text-slate-700">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/users/${user.id}`)}
                    className="btn btn-secondary"
                  >
                    <Eye size={14} />
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditForm(user)}
                    className="btn btn-secondary"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  {user.status === "ACTIVE" ? (
                    <button
                      type="button"
                      onClick={() => deactivateMutation.mutate(user.id)}
                      className="btn btn-danger"
                    >
                      <Power size={14} />
                      Disable
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => activateMutation.mutate(user.id)}
                      className="btn btn-success"
                    >
                      <Power size={14} />
                      Activate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {}
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
      {}
      <section className="panel flex flex-row items-center justify-end gap-3 p-5">
        <button
          type="button"
          onClick={() => setParams(defaultParams)}
          className="btn btn-secondary w-fit whitespace-nowrap"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="btn btn-secondary w-fit whitespace-nowrap"
        >
          <Download size={15} />
          Export
        </button>
        <button
          type="button"
          onClick={() => users.refetch()}
          className="btn btn-primary w-fit whitespace-nowrap"
        >
          Refresh
        </button>
      </section>
    </div>
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
  editing,
}: {
  title: string;
  form: UserManagementForm;
  setForm: React.Dispatch<React.SetStateAction<UserManagementForm>>;
  loading: boolean;
  error: Error | null;
  onClose: () => void;
  onSubmit: () => void;
  editing: boolean;
}) {
  const organizations = initialOrganizations.filter(
    (organization) => organization.tenantId === form.tenantId,
  );
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">{title}</h3>
            <p className="mt-1 text-xs text-slate-400">
              Enter user information and access details.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-6 p-5">
          {}
          <FormSection title="User Information">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="First Name *"
                value={form.firstName}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    firstName: value,
                  }))
                }
                placeholder="Enter first name"
              />
              <FormInput
                label="Last Name *"
                value={form.lastName}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    lastName: value,
                  }))
                }
                placeholder="Enter last name"
              />
              <FormInput
                label="Employee ID"
                value={form.employeeId}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    employeeId: value,
                  }))
                }
                placeholder="Employee ID"
              />
              <FormInput
                label="Email Address *"
                type="email"
                value={form.email}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    email: value,
                  }))
                }
                placeholder="Enter email"
              />
              <FormInput
                label="Mobile Number"
                value={form.mobileNumber}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    mobileNumber: value,
                  }))
                }
                placeholder="Enter mobile number"
              />
            </div>
          </FormSection>
          {}
          <FormSection title="Organization Details">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormSelect
                label="Tenant"
                value={form.tenantId}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    tenantId: Number(value),
                    organizationId: 0,
                  }))
                }
                options={initialTenants.map((tenant) => ({
                  value: tenant.id,
                  label: tenant.name,
                }))}
                placeholder="Select Tenant"
              />
              <FormSelect
                label="Organization"
                value={form.organizationId}
                disabled={!form.tenantId}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    organizationId: Number(value),
                  }))
                }
                options={organizations.map((organization) => ({
                  value: organization.id,
                  label: organization.name,
                }))}
                placeholder="Select Organization"
              />
              <FormSelect
                label="Business Unit"
                value={form.businessUnit}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    businessUnit: value,
                  }))
                }
                options={[
                  {
                    value: "Technology Division",
                    label: "Technology Division",
                  },
                  {
                    value: "Finance Division",
                    label: "Finance Division",
                  },
                  {
                    value: "Operations Division",
                    label: "Operations Division",
                  },
                ]}
              />
              <FormSelect
                label="Department"
                value={form.department}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    department: value,
                  }))
                }
                options={[
                  {
                    value: "Information Technology",
                    label: "Information Technology",
                  },
                  {
                    value: "Human Resources",
                    label: "Human Resources",
                  },
                  {
                    value: "Finance",
                    label: "Finance",
                  },
                  {
                    value: "Sales",
                    label: "Sales",
                  },
                ]}
              />
              <FormSelect
                label="Branch"
                value={form.branch}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    branch: value,
                  }))
                }
                options={[
                  {
                    value: "Hyderabad",
                    label: "Hyderabad",
                  },
                  {
                    value: "Bangalore",
                    label: "Bangalore",
                  },
                  {
                    value: "Mumbai",
                    label: "Mumbai",
                  },
                  {
                    value: "Chennai",
                    label: "Chennai",
                  },
                ]}
              />
            </div>
          </FormSection>
          {}
          <FormSection title="Access Information">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormInput
                label="Username *"
                value={form.username}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    username: value,
                  }))
                }
                placeholder="Enter username"
              />
              <FormSelect
                label="Role"
                value={form.role}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    role: value as UserRole,
                  }))
                }
                options={[
                  {
                    value: "ADMIN",
                    label: "System Administrator",
                  },
                  {
                    value: "MANAGER",
                    label: "Manager",
                  },
                  {
                    value: "USER",
                    label: "Executive",
                  },
                ]}
              />
              <FormSelect
                label="Reporting Manager"
                value={form.reportingManager}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    reportingManager: value,
                  }))
                }
                options={[
                  {
                    value: "Select Employee",
                    label: "Select Employee",
                  },
                  {
                    value: "Manager 1",
                    label: "Manager 1",
                  },
                  {
                    value: "Manager 2",
                    label: "Manager 2",
                  },
                ]}
              />
            </div>
          </FormSection>
          {}
          <FormSection title="Account Status">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="field-label">Status</label>
                <div className="flex gap-5">
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="radio"
                      checked={form.status === "ACTIVE"}
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          status: "ACTIVE",
                        }))
                      }
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="radio"
                      checked={form.status === "INACTIVE"}
                      onChange={() =>
                        setForm((current) => ({
                          ...current,
                          status: "INACTIVE",
                        }))
                      }
                    />
                    Inactive
                  </label>
                </div>
              </div>
              <VerificationCheckbox
                label="Email Verification"
                checked={form.emailVerified}
                onChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    emailVerified: checked,
                  }))
                }
              />
              <VerificationCheckbox
                label="Mobile Verification"
                checked={form.mobileVerified}
                onChange={(checked) =>
                  setForm((current) => ({
                    ...current,
                    mobileVerified: checked,
                  }))
                }
              />
            </div>
          </FormSection>
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
              {error.message}
            </div>
          )}
        </div>
        {}
        <div className="flex flex-row justify-end gap-3 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn btn-secondary w-fit whitespace-nowrap"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="btn btn-primary w-fit whitespace-nowrap"
          >
            {loading ? "Saving..." : editing ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="mb-4 text-sm font-extrabold text-slate-800">{title}</h3>
  );
}
function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h4 className="mb-3 text-sm font-extrabold text-slate-800">{title}</h4>
      <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
        {children}
      </div>
    </section>
  );
}
function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="field-input"
      />
    </div>
  );
}
function FormSelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: {
    value: string | number;
    label: string;
  }[];
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="field-input disabled:bg-slate-100"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
function VerificationCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        {checked ? "Verified" : "Not Verified"}
      </label>
    </div>
  );
}
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: {
    value: string | number;
    label: string;
  }[];
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-input"
      >
        <option value="">All {label}s</option>
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
      {children}
    </th>
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
function formatRole(role: UserRole) {
  if (role === "ADMIN") {
    return "Administrator";
  }
  if (role === "MANAGER") {
    return "Manager";
  }
  return "Executive";
}
