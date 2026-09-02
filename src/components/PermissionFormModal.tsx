import { useEffect, useState } from "react";
import type { PermissionFormValues } from "../types";
type PermissionFormModalProps = {
  open: boolean;
  editing: boolean;
  initialValues: PermissionFormValues;
  submitting: boolean;
  error?: Error | null;
  onClose: () => void;
  onSubmit: (values: PermissionFormValues) => void;
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
export default function PermissionFormModal({
  open,
  editing,
  initialValues,
  submitting,
  error,
  onClose,
  onSubmit,
}: PermissionFormModalProps) {
  const [form, setForm] = useState<PermissionFormValues>(initialValues);
  useEffect(() => {
    if (open) {
      setForm(initialValues);
    }
  }, [open, initialValues]);
  if (!open) {
    return null;
  }
  function updateField<K extends keyof PermissionFormValues>(
    field: K,
    value: PermissionFormValues[K],
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
      name: form.name.trim().toUpperCase(),
      description: form.description.trim(),
    });
  }
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-lg font-extrabold">
            {editing ? "Edit Permission" : "Create Permission"}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            {editing
              ? "Update permission configuration."
              : "Create a new platform permission."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div>
            <label className="mb-1.5 block text-xs font-bold">
              Permission Name
            </label>
            <input
              type="text"
              value={form.name}
              disabled={editing || submitting}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="e.g. CREATE_USER"
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
              placeholder="Describe what this permission allows..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold">Module</label>
            <select
              value={form.module}
              disabled={submitting}
              onChange={(event) => updateField("module", event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
              required
            >
              <option value="">Select Module</option>
              {moduleOptions.map((module) => (
                <option key={module} value={module}>
                  {module}
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
                  event.target.value as PermissionFormValues["status"],
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
                  ? "Update Permission"
                  : "Create Permission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
