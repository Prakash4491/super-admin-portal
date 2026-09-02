import { useEffect, useState } from "react";
import type { RoleFormValues } from "../types";
type RoleFormModalProps = {
  open: boolean;
  editing: boolean;
  initialValues: RoleFormValues;
  tenantOptions: Array<{
    id: number;
    name: string;
  }>;
  submitting: boolean;
  error?: Error | null;
  onClose: () => void;
  onSubmit: (values: RoleFormValues) => void;
};
export default function RoleFormModal({
  open,
  editing,
  initialValues,
  tenantOptions,
  submitting,
  error,
  onClose,
  onSubmit,
}: RoleFormModalProps) {
  const [form, setForm] = useState<RoleFormValues>(initialValues);
  useEffect(() => {
    if (open) {
      setForm(initialValues);
    }
  }, [open, initialValues]);
  if (!open) {
    return null;
  }
  function updateField<K extends keyof RoleFormValues>(
    field: K,
    value: RoleFormValues[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...form,
      name: form.name.trim(),
      description: form.description.trim(),
    });
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-extrabold">
            {editing ? "Edit Role" : "Create Role"}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {editing
              ? "Update role configuration."
              : "Create a new role for a tenant."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold">Role Name</label>
            <input
              type="text"
              value={form.name}
              disabled={editing || submitting}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="e.g. ADMIN"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold">
              Description
            </label>
            <textarea
              value={form.description}
              disabled={submitting}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="Describe what this role can access..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold">Tenant</label>
            <select
              value={form.tenantId}
              disabled={submitting}
              onChange={(event) =>
                updateField("tenantId", Number(event.target.value))
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
              required
            >
              <option value="">Select Tenant</option>
              {tenantOptions.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold">Status</label>
            <select
              value={form.status}
              disabled={submitting}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as RoleFormValues["status"],
                )
              }
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
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
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : editing
                  ? "Update Role"
                  : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
