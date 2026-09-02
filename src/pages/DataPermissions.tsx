import {
  Eye,
  Filter,
  KeyRound,
  Pencil,
  Plus,
  Power,
  RotateCcw,
  Save,
  Search,
  Shield,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useActivateDataPermission,
  useCreateDataPermission,
  useDataPermissions,
  useDeactivateDataPermission,
  useUpdateDataPermission,
} from "../hooks/useDataPermissions";
import { initialTenants } from "../data/tenants";
import { initialRoles } from "../data/roles";
import type {
  DataPermission,
  DataPermissionScope,
  RecordOwnership,
} from "../types";
type FormState = {
  policyName: string;
  policyType: string;
  organizationId: number;
  roleId: number;
  status: "ACTIVE" | "INACTIVE";
  scopes: DataPermissionScope[];
  department: string;
  businessUnit: string;
  branch: string;
  project: string;
  location: string;
  customer: string;
  vendor: string;
  ownershipRules: RecordOwnership[];
  viewSubordinateRecords: boolean;
  approveSubordinateTransactions: boolean;
};
const emptyForm: FormState = {
  policyName: "",
  policyType: "Department-Based",
  organizationId: 1,
  roleId: 1,
  status: "ACTIVE",
  scopes: [],
  department: "",
  businessUnit: "",
  branch: "",
  project: "",
  location: "",
  customer: "",
  vendor: "",
  ownershipRules: [],
  viewSubordinateRecords: false,
  approveSubordinateTransactions: false,
};
const scopeOptions: DataPermissionScope[] = [
  "ORGANIZATION",
  "BUSINESS_UNIT",
  "DEPARTMENT",
  "BRANCH",
  "PROJECT",
  "LOCATION",
  "CUSTOMER",
  "VENDOR",
];
const ownershipOptions: RecordOwnership[] = [
  "OWN_RECORDS",
  "TEAM_RECORDS",
  "DEPARTMENT_RECORDS",
  "ORGANIZATION_RECORDS",
];
export default function DataPermissions() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"list" | "create" | "edit">("list");
  const [editingPolicyId, setEditingPolicyId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
  });
  const [formError, setFormError] = useState("");
  const dataPermissions = useDataPermissions();
  const activateMutation = useActivateDataPermission();
  const deactivateMutation = useDeactivateDataPermission();
  const createMutation = useCreateDataPermission();
  const updateMutation = useUpdateDataPermission();
  const filteredPolicies = useMemo(() => {
    const policies = dataPermissions.data ?? [];
    return policies.filter((policy) => {
      const searchValue = search.trim().toLowerCase();
      const matchesSearch =
        !searchValue ||
        policy.policyName.toLowerCase().includes(searchValue) ||
        policy.policyType.toLowerCase().includes(searchValue) ||
        policy.organization.toLowerCase().includes(searchValue) ||
        policy.roleName.toLowerCase().includes(searchValue);
      const matchesOrganization =
        !organizationFilter || policy.organization === organizationFilter;
      const matchesRole = !roleFilter || policy.roleName === roleFilter;
      const matchesStatus = !statusFilter || policy.status === statusFilter;
      return (
        matchesSearch && matchesOrganization && matchesRole && matchesStatus
      );
    });
  }, [
    dataPermissions.data,
    search,
    organizationFilter,
    roleFilter,
    statusFilter,
  ]);
  const policies = dataPermissions.data ?? [];
  const organizations = [
    ...new Set(policies.map((policy) => policy.organization)),
  ];
  const roles = [...new Set(policies.map((policy) => policy.roleName))];
  const availableRoles = initialRoles.filter(
    (role) => role.tenantId === form.organizationId,
  );
  function openCreate() {
    const firstRole = initialRoles.find(
      (role) => role.tenantId === emptyForm.organizationId,
    );
    setForm({
      ...emptyForm,
      roleId: firstRole?.id ?? 0,
      scopes: [],
      ownershipRules: [],
    });
    setEditingPolicyId(null);
    setFormError("");
    setMode("create");
  }
  function openEdit(policy: DataPermission) {
    setForm({
      policyName: policy.policyName,
      policyType: policy.policyType,
      organizationId: policy.organizationId,
      roleId: policy.roleId,
      status: policy.status,
      scopes: [...policy.scopes],
      department: policy.department ?? "",
      businessUnit: policy.businessUnit ?? "",
      branch: policy.branch ?? "",
      project: policy.project ?? "",
      location: policy.location ?? "",
      customer: policy.customer ?? "",
      vendor: policy.vendor ?? "",
      ownershipRules: [...policy.ownershipRules],
      viewSubordinateRecords: policy.viewSubordinateRecords,
      approveSubordinateTransactions: policy.approveSubordinateTransactions,
    });
    setEditingPolicyId(policy.id);
    setFormError("");
    setMode("edit");
  }
  function closeForm() {
    setMode("list");
    setEditingPolicyId(null);
    setForm({
      ...emptyForm,
    });
    setFormError("");
  }
  function updateField(
    field: keyof FormState,
    value: string | number | boolean,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }
  function handleOrganizationChange(organizationId: number) {
    const firstRole = initialRoles.find(
      (role) => role.tenantId === organizationId,
    );
    setForm((previous) => ({
      ...previous,
      organizationId,
      roleId: firstRole?.id ?? 0,
    }));
  }
  function toggleArrayValue(
    field: "scopes" | "ownershipRules",
    value: DataPermissionScope | RecordOwnership,
  ) {
    setForm((previous) => {
      if (field === "scopes") {
        const current = previous.scopes;
        const scope = value as DataPermissionScope;
        const exists = current.includes(scope);
        return {
          ...previous,
          scopes: exists
            ? current.filter((item) => item !== scope)
            : [...current, scope],
        };
      }
      const current = previous.ownershipRules;
      const ownership = value as RecordOwnership;
      const exists = current.includes(ownership);
      return {
        ...previous,
        ownershipRules: exists
          ? current.filter((item) => item !== ownership)
          : [...current, ownership],
      };
    });
  }
  function resetForm() {
    if (mode === "edit" && editingPolicyId !== null) {
      const existing = policies.find((policy) => policy.id === editingPolicyId);
      if (existing) {
        openEdit(existing);
        return;
      }
    }
    openCreate();
  }
  function validateForm() {
    if (!form.policyName.trim()) {
      return "Policy name is required.";
    }
    if (form.scopes.length === 0) {
      return "Select at least one data scope.";
    }
    if (form.ownershipRules.length === 0) {
      return "Select at least one ownership rule.";
    }
    if (!form.organizationId) {
      return "Select an organization.";
    }
    if (!form.roleId) {
      return "Select a role.";
    }
    return "";
  }
  async function handleSave() {
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError("");
    const organization = initialTenants.find(
      (tenant) => tenant.id === form.organizationId,
    );
    const role = initialRoles.find((item) => item.id === form.roleId);
    if (!organization) {
      setFormError("Organization not found.");
      return;
    }
    if (!role) {
      setFormError("Role not found.");
      return;
    }
    if (mode === "create") {
      await createMutation.mutateAsync({
        policyName: form.policyName.trim(),
        policyType: form.policyType,
        organization: organization.name,
        organizationId: form.organizationId,
        roleId: form.roleId,
        roleName: role.name,
        status: form.status,
        scopes: form.scopes,
        department: form.department || undefined,
        businessUnit: form.businessUnit || undefined,
        branch: form.branch || undefined,
        project: form.project || undefined,
        location: form.location || undefined,
        customer: form.customer || undefined,
        vendor: form.vendor || undefined,
        ownershipRules: form.ownershipRules,
        viewSubordinateRecords: form.viewSubordinateRecords,
        approveSubordinateTransactions: form.approveSubordinateTransactions,
      });
      closeForm();
      return;
    }
    if (mode === "edit" && editingPolicyId !== null) {
      const existing = policies.find((policy) => policy.id === editingPolicyId);
      if (!existing) {
        setFormError("Policy not found.");
        return;
      }
      const updatedPolicy: DataPermission = {
        ...existing,
        policyName: form.policyName.trim(),
        policyType: form.policyType,
        organization: organization.name,
        organizationId: form.organizationId,
        roleId: form.roleId,
        roleName: role.name,
        status: form.status,
        scopes: form.scopes,
        department: form.department || undefined,
        businessUnit: form.businessUnit || undefined,
        branch: form.branch || undefined,
        project: form.project || undefined,
        location: form.location || undefined,
        customer: form.customer || undefined,
        vendor: form.vendor || undefined,
        ownershipRules: form.ownershipRules,
        viewSubordinateRecords: form.viewSubordinateRecords,
        approveSubordinateTransactions: form.approveSubordinateTransactions,
        lastModified: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
      await updateMutation.mutateAsync(updatedPolicy);
      closeForm();
    }
  }
  if (dataPermissions.isPending && mode === "list") {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-slate-500">Loading data permissions...</p>
      </div>
    );
  }
  if (dataPermissions.isError && mode === "list") {
    return (
      <div className="panel p-6">
        <p className="font-bold text-red-600">
          Failed to load data permissions.
        </p>
        <button
          type="button"
          onClick={() => dataPermissions.refetch()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }
  if (mode !== "list") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={closeForm}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            ←
          </button>
          <div>
            <h2 className="text-2xl font-extrabold">
              {mode === "create"
                ? "Create Data Permission"
                : "Edit Data Permission"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Configure data access policies across organizations and roles.
            </p>
          </div>
        </div>
        {formError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
            {formError}
          </div>
        )}
        <section className="panel">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center gap-2">
              <KeyRound size={18} className="text-blue-600" />
              <h3 className="text-sm font-extrabold">Policy Information</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <FormField label="Policy Name" required>
              <input
                value={form.policyName}
                onChange={(event) =>
                  updateField("policyName", event.target.value)
                }
                placeholder="Enter policy name"
                className={inputClass}
              />
            </FormField>
            <FormField label="Policy Type" required>
              <select
                value={form.policyType}
                onChange={(event) =>
                  updateField("policyType", event.target.value)
                }
                className={inputClass}
              >
                <option value="Organization-Based">Organization-Based</option>
                <option value="Department-Based">Department-Based</option>
                <option value="Branch-Based">Branch-Based</option>
                <option value="Ownership-Based">Ownership-Based</option>
              </select>
            </FormField>
            <FormField label="Organization" required>
              <select
                value={form.organizationId}
                onChange={(event) =>
                  handleOrganizationChange(Number(event.target.value))
                }
                className={inputClass}
              >
                {initialTenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Role" required>
              <select
                value={form.roleId}
                onChange={(event) =>
                  updateField("roleId", Number(event.target.value))
                }
                className={inputClass}
              >
                {availableRoles.length > 0 ? (
                  availableRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))
                ) : (
                  <option value={0}>No roles available</option>
                )}
              </select>
            </FormField>
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as "ACTIVE" | "INACTIVE",
                  )
                }
                className={inputClass}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </FormField>
          </div>
        </section>
        <section className="panel">
          <div className="border-b border-slate-200 p-5">
            <h3 className="text-sm font-extrabold">Data Scope</h3>
            <p className="mt-1 text-xs text-slate-400">
              Select the data areas this policy applies to.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {scopeOptions.map((scope) => {
              const checked = form.scopes.includes(scope);
              return (
                <label
                  key={scope}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    checked
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayValue("scopes", scope)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {formatValue(scope)}
                  </span>
                </label>
              );
            })}
          </div>
        </section>
        <section className="panel">
          <div className="border-b border-slate-200 p-5">
            <h3 className="text-sm font-extrabold">Access Mapping</h3>
            <p className="mt-1 text-xs text-slate-400">
              Define the organizational boundaries for this policy.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 lg:grid-cols-3">
            <FormField label="Department">
              <input
                value={form.department}
                onChange={(event) =>
                  updateField("department", event.target.value)
                }
                placeholder="e.g. Human Resources"
                className={inputClass}
              />
            </FormField>
            <FormField label="Business Unit">
              <input
                value={form.businessUnit}
                onChange={(event) =>
                  updateField("businessUnit", event.target.value)
                }
                placeholder="e.g. Corporate Services"
                className={inputClass}
              />
            </FormField>
            <FormField label="Branch">
              <input
                value={form.branch}
                onChange={(event) => updateField("branch", event.target.value)}
                placeholder="e.g. Hyderabad"
                className={inputClass}
              />
            </FormField>
            <FormField label="Project">
              <input
                value={form.project}
                onChange={(event) => updateField("project", event.target.value)}
                placeholder="Project name"
                className={inputClass}
              />
            </FormField>
            <FormField label="Location">
              <input
                value={form.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder="Location"
                className={inputClass}
              />
            </FormField>
            <FormField label="Customer">
              <input
                value={form.customer}
                onChange={(event) =>
                  updateField("customer", event.target.value)
                }
                placeholder="Customer"
                className={inputClass}
              />
            </FormField>
            <FormField label="Vendor">
              <input
                value={form.vendor}
                onChange={(event) => updateField("vendor", event.target.value)}
                placeholder="Vendor"
                className={inputClass}
              />
            </FormField>
          </div>
        </section>
        <section className="panel">
          <div className="border-b border-slate-200 p-5">
            <h3 className="text-sm font-extrabold">Record Ownership</h3>
            <p className="mt-1 text-xs text-slate-400">
              Select which records the role can access.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
            {ownershipOptions.map((rule) => {
              const checked = form.ownershipRules.includes(rule);
              return (
                <label
                  key={rule}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    checked
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleArrayValue("ownershipRules", rule)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    {formatValue(rule)}
                  </span>
                </label>
              );
            })}
          </div>
        </section>
        <section className="panel">
          <div className="border-b border-slate-200 p-5">
            <h3 className="text-sm font-extrabold">Manager Access</h3>
            <p className="mt-1 text-xs text-slate-400">
              Configure additional manager access.
            </p>
          </div>
          <div className="space-y-3 p-5">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={form.viewSubordinateRecords}
                onChange={(event) =>
                  updateField("viewSubordinateRecords", event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <div>
                <strong className="block text-sm font-bold">
                  View Subordinate Records
                </strong>
                <span className="text-xs text-slate-400">
                  Allow managers to view records belonging to their
                  subordinates.
                </span>
              </div>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={form.approveSubordinateTransactions}
                onChange={(event) =>
                  updateField(
                    "approveSubordinateTransactions",
                    event.target.checked,
                  )
                }
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <div>
                <strong className="block text-sm font-bold">
                  Approve Subordinate Transactions
                </strong>
                <span className="text-xs text-slate-400">
                  Allow managers to approve subordinate transactions.
                </span>
              </div>
            </label>
          </div>
        </section>
        <section className="panel flex flex-col gap-3 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={15} />
            Reset
          </button>
          <button
            type="button"
            disabled={createMutation.isPending || updateMutation.isPending}
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={15} />
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : mode === "create"
                ? "Create Policy"
                : "Save Changes"}
          </button>
        </section>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-red-500">
              DATA PERMISSIONS
            </h2>
          </div>
          <p className="mt-1 text-sm font-extrabold text-slate-700">
            Manage data access policies across organizations and roles.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-blue-700"
        >
          <Plus size={15} />
          Create Policy
        </button>
      </div>
      <section className="panel p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search policies..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
            />
          </div>
          <select
            value={organizationFilter}
            onChange={(event) => setOrganizationFilter(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Organizations</option>
            {organizations.map((organization) => (
              <option key={organization} value={organization}>
                {organization}
              </option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
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
                <th className="px-4 py-3 text-left text-[11px] font-extrabold text-slate-500">
                  Policy
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-extrabold text-slate-500">
                  Organization
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-extrabold text-slate-500">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-extrabold text-slate-500">
                  Data Scope
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-extrabold text-slate-500">
                  Ownership
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-extrabold text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-[11px] font-extrabold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                        <KeyRound size={17} />
                      </div>
                      <div>
                        <strong className="block text-sm font-extrabold">
                          {policy.policyName}
                        </strong>
                        <span className="text-[11px] text-slate-400">
                          {policy.policyType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">{policy.organization}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      <Shield size={12} />
                      {policy.roleName}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {policy.scopes.slice(0, 2).map((scope) => (
                        <span
                          key={scope}
                          className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700"
                        >
                          {formatScope(scope)}
                        </span>
                      ))}
                      {policy.scopes.length > 2 && (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                          +{policy.scopes.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-semibold text-slate-600">
                      {formatOwnership(policy.ownershipRules[0])}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={policy.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        title="View"
                        onClick={() =>
                          navigate(`/dataPermissions/${policy.id}`)
                        }
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => openEdit(policy)}
                        className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil size={15} />
                      </button>
                      {policy.status === "ACTIVE" ? (
                        <button
                          type="button"
                          title="Deactivate"
                          disabled={deactivateMutation.isPending}
                          onClick={() => deactivateMutation.mutate(policy.id)}
                          className="rounded-md p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Power size={15} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          title="Activate"
                          disabled={activateMutation.isPending}
                          onClick={() => activateMutation.mutate(policy.id)}
                          className="rounded-md p-1.5 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
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
        {filteredPolicies.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-400">
              <Filter size={22} />
            </div>
            <h3 className="mt-4 text-sm font-extrabold">
              No data permission policies found
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </section>
      <div className="text-xs text-slate-400">
        Showing{" "}
        <strong className="text-slate-600">{filteredPolicies.length}</strong> of{" "}
        <strong className="text-slate-600">{policies.length}</strong> policies
      </div>
    </div>
  );
}
function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500";
function formatScope(scope: string) {
  return scope
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
function formatOwnership(ownership: string) {
  return ownership
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
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
type DataPermissionFormValues = {
  policyName: string;
  policyType: string;
  organization: string;
  organizationId: number;
  roleId: number;
  roleName: string;
  status: "ACTIVE" | "INACTIVE";
  scopes: DataPermissionScope[];
  department?: string;
  businessUnit?: string;
  branch?: string;
  project?: string;
  location?: string;
  customer?: string;
  vendor?: string;
  ownershipRules: RecordOwnership[];
  viewSubordinateRecords: boolean;
  approveSubordinateTransactions: boolean;
};
