import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import {
  useCreateTenant,
  useTenant,
  useUpdateTenant
} from "../hooks/useTenants";
import type { Plan, TenantFormValues, TenantStatus } from "../types";

const emptyForm: TenantFormValues = {
  name: "",
  code: "",
  adminName: "",
  adminEmail: "",
  phone: "",
  plan: "ENTERPRISE",
  country: "India",
  timeZone: "Asia/Kolkata",
  status: "ACTIVE"
};

type FormErrors = Partial<Record<keyof TenantFormValues, string>>;

export default function TenantForm() {
  const { id } = useParams();
  const tenantId = Number(id);
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const tenantQuery = useTenant(tenantId);
  const create = useCreateTenant();
  const update = useUpdateTenant();

  const [form, setForm] = useState<TenantFormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (tenantQuery.data) {
      setForm({
        name: tenantQuery.data.name,
        code: tenantQuery.data.code,
        adminName: tenantQuery.data.adminName,
        adminEmail: tenantQuery.data.adminEmail,
        phone: tenantQuery.data.phone,
        plan: tenantQuery.data.plan,
        country: tenantQuery.data.country,
        timeZone: tenantQuery.data.timeZone,
        status: tenantQuery.data.status
      });
    }
  }, [tenantQuery.data]);

  if (isEdit && tenantQuery.isPending) {
    return <Loading text="Loading tenant..." />;
  }

  if (isEdit && tenantQuery.isError) {
    return <ErrorState error={tenantQuery.error} onRetry={tenantQuery.refetch} />;
  }

  function updateField<K extends keyof TenantFormValues>(
    field: K,
    value: TenantFormValues[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const next: FormErrors = {};

    if (!form.name.trim()) next.name = "Tenant name is required.";
    if (!form.code.trim()) next.code = "Tenant code is required.";
    if (!form.adminName.trim()) next.adminName = "Admin name is required.";

    if (!form.adminEmail.trim()) {
      next.adminEmail = "Admin email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.adminEmail)) {
      next.adminEmail = "Enter a valid email.";
    }

    if (!form.plan) next.plan = "Subscription is required.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) return;

    try {
      if (isEdit) {
        await update.mutateAsync({
          id: tenantId,
          values: {
            name: form.name,
            adminName: form.adminName,
            adminEmail: form.adminEmail,
            phone: form.phone,
            plan: form.plan,
            country: form.country,
            timeZone: form.timeZone,
            status: form.status
          }
        });

        navigate(`/tenants/${tenantId}`);
      } else {
        const created = await create.mutateAsync(form);
        navigate(`/tenants/${created.id}`);
      }
    } catch {
      // Mutation error is displayed below.
    }
  }

  const mutationError = create.error ?? update.error;
  const isSaving = create.isPending || update.isPending;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">
            {isEdit ? "Edit Tenant" : "Create New Tenant"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? "Update tenant configuration."
              : "Add a new tenant to the platform."}
          </p>
        </div>
        <Link
          className="btn btn-secondary"
          to={isEdit ? `/tenants/${tenantId}` : "/tenants"}
        >
          Cancel
        </Link>
      </div>

      <section className="panel p-5 md:p-7">
        <form onSubmit={submit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <TextField
              label="Tenant Name"
              value={form.name}
              error={errors.name}
              onChange={(value) => updateField("name", value)}
            />

            <TextField
              label="Tenant Code"
              value={form.code}
              error={errors.code}
              disabled={isEdit}
              onChange={(value) => updateField("code", value)}
            />

            <TextField
              label="Admin Name"
              value={form.adminName}
              error={errors.adminName}
              onChange={(value) => updateField("adminName", value)}
            />

            <TextField
              label="Admin Email"
              type="email"
              value={form.adminEmail}
              error={errors.adminEmail}
              onChange={(value) => updateField("adminEmail", value)}
            />

            <TextField
              label="Phone"
              value={form.phone}
              onChange={(value) => updateField("phone", value)}
            />

            <SelectField
              label="Subscription"
              value={form.plan}
              error={errors.plan}
              options={[
                ["ENTERPRISE", "Enterprise"],
                ["PRO", "Pro"],
                ["BASIC", "Basic"]
              ]}
              onChange={(value) => updateField("plan", value as Plan)}
            />

            <SelectField
              label="Country"
              value={form.country}
              options={[
                ["India", "India"],
                ["United States", "United States"],
                ["United Kingdom", "United Kingdom"]
              ]}
              onChange={(value) => updateField("country", value)}
            />

            <SelectField
              label="Time Zone"
              value={form.timeZone}
              options={[
                ["Asia/Kolkata", "Asia/Kolkata"],
                ["UTC", "UTC"],
                ["America/New_York", "America/New_York"]
              ]}
              onChange={(value) => updateField("timeZone", value)}
            />

            <SelectField
              label="Status"
              value={form.status}
              options={[
                ["ACTIVE", "Active"],
                ["INACTIVE", "Inactive"]
              ]}
              onChange={(value) => updateField("status", value as TenantStatus)}
            />
          </div>

          {mutationError && (
            <div className="mt-5 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs text-red-700">
              {mutationError instanceof Error
                ? mutationError.message
                : "Unable to save tenant."}
            </div>
          )}

          <div className="mt-7 flex justify-end gap-2 border-t border-line pt-5">
            <Link
              className="btn btn-secondary"
              to={isEdit ? `/tenants/${tenantId}` : "/tenants"}
            >
              Cancel
            </Link>
            <button className="btn btn-primary" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Tenant"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function TextField({
  label,
  value,
  error,
  disabled,
  type = "text",
  onChange
}: {
  label: string;
  value: string;
  error?: string;
  disabled?: boolean;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <input
        className="field-input disabled:bg-slate-50 disabled:text-slate-400"
        type={type}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

function SelectField({
  label,
  value,
  error,
  options,
  onChange
}: {
  label: string;
  value: string;
  error?: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <select
        className="field-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}
