import { useEffect, useState } from "react";
import { initialGlobalSettings } from "../data/globalSettings";
import {
  RefreshCw,
  RotateCcw,
  Save,
  Settings,
  Shield,
  Bell,
  Globe2,
} from "lucide-react";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import {
  useGlobalSettings,
  useResetGlobalSettings,
  useUpdateGlobalSettings,
} from "../hooks/useGlobalSettings";
import type { GlobalSettings as GlobalSettingsType } from "../types";
type Errors = {
  defaultLanguage?: string;
  timeZone?: string;
  defaultCurrency?: string;
  passwordExpiry?: string;
  sessionTimeout?: string;
  maximumLoginAttempts?: string;
  maximumFileUploadSize?: string;
};
export default function GlobalSettings() {
  const settingsQuery = useGlobalSettings();
  const updateSettings = useUpdateGlobalSettings();
  const resetSettings = useResetGlobalSettings();
  const [form, setForm] = useState<GlobalSettingsType>(initialGlobalSettings);
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (settingsQuery.data) {
      setForm(settingsQuery.data);
    }
  }, [settingsQuery.data]);
  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => {
      setSaved(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [saved]);
  if (settingsQuery.isPending) {
    return <Loading text="Loading global settings..." />;
  }
  if (settingsQuery.isError) {
    return (
      <ErrorState error={settingsQuery.error} onRetry={settingsQuery.refetch} />
    );
  }
  function updateField<K extends keyof GlobalSettingsType>(
    field: K,
    value: GlobalSettingsType[K],
  ) {
    setForm((current) => {
      if (!current) return current;
      return {
        ...current,
        [field]: value,
      };
    });
    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }
  function validate() {
    const newErrors: Errors = {};
    if (!form.defaultLanguage) {
      newErrors.defaultLanguage = "Default language is required.";
    }
    if (!form.timeZone) {
      newErrors.timeZone = "Time zone is required.";
    }
    if (!form.defaultCurrency) {
      newErrors.defaultCurrency = "Default currency is required.";
    }
    if (form.passwordExpiry < 30 || form.passwordExpiry > 365) {
      newErrors.passwordExpiry =
        "Password expiry must be between 30 and 365 days.";
    }
    if (form.sessionTimeout < 5 || form.sessionTimeout > 240) {
      newErrors.sessionTimeout =
        "Session timeout must be between 5 and 240 minutes.";
    }
    if (form.maximumLoginAttempts < 3 || form.maximumLoginAttempts > 10) {
      newErrors.maximumLoginAttempts =
        "Maximum login attempts must be between 3 and 10.";
    }
    if (form.maximumFileUploadSize <= 0) {
      newErrors.maximumFileUploadSize =
        "Maximum file upload size must be greater than 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }
  async function handleSave() {
    if (!validate()) return;
    await updateSettings.mutateAsync(form);
    setSaved(true);
  }
  async function handleReset() {
    const resetData = await resetSettings.mutateAsync();
    setForm(resetData);
    setErrors({});
    setSaved(false);
  }
  async function handleRefresh() {
    const result = await settingsQuery.refetch();
    if (result.data) {
      setForm(result.data);
    }
    setErrors({});
    setSaved(false);
  }
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-red-500">
          GLOBAL SETTINGS
        </h2>
        <p className="mt-1 text-sm font-extrabold text-black-500">
          Manage platform-wide regional, security, notification and application
          settings.
        </p>
      </div>
      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          Global settings saved successfully.
        </div>
      )}
      <SettingsSection icon={<Globe2 size={18} />} title="Regional Settings">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Default Language" required>
            <select
              className="field-input"
              value={form.defaultLanguage}
              onChange={(e) => updateField("defaultLanguage", e.target.value)}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
            {errors.defaultLanguage && (
              <p className="field-error">{errors.defaultLanguage}</p>
            )}
          </Field>
          <Field label="Time Zone" required>
            <select
              className="field-input"
              value={form.timeZone}
              onChange={(e) => updateField("timeZone", e.target.value)}
            >
              <option value="Asia/Kolkata (UTC +05:30)">
                Asia/Kolkata (UTC +05:30)
              </option>
              <option value="UTC">UTC</option>
              <option value="America/New_York (UTC -05:00)">
                America/New_York (UTC -05:00)
              </option>
              <option value="Europe/London (UTC +00:00)">
                Europe/London (UTC +00:00)
              </option>
            </select>
            {errors.timeZone && (
              <p className="field-error">{errors.timeZone}</p>
            )}
          </Field>
          <Field label="Date Format">
            <select
              className="field-input"
              value={form.dateFormat}
              onChange={(e) => updateField("dateFormat", e.target.value)}
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </Field>
          <Field label="Time Format">
            <select
              className="field-input"
              value={form.timeFormat}
              onChange={(e) => updateField("timeFormat", e.target.value)}
            >
              <option value="24 Hours">24 Hours</option>
              <option value="12 Hours">12 Hours</option>
            </select>
          </Field>
          <Field label="Default Currency" required>
            <select
              className="field-input"
              value={form.defaultCurrency}
              onChange={(e) => updateField("defaultCurrency", e.target.value)}
            >
              <option value="INR (₹)">INR (₹)</option>
              <option value="USD ($)">USD ($)</option>
              <option value="EUR (€)">EUR (€)</option>
              <option value="GBP (£)">GBP (£)</option>
            </select>
            {errors.defaultCurrency && (
              <p className="field-error">{errors.defaultCurrency}</p>
            )}
          </Field>
        </div>
      </SettingsSection>
      <SettingsSection icon={<Shield size={18} />} title="Security Settings">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Password Expiry">
            <div className="relative">
              <input
                type="number"
                min={30}
                max={365}
                className="field-input pr-14"
                value={form.passwordExpiry}
                onChange={(e) =>
                  updateField("passwordExpiry", Number(e.target.value))
                }
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Days
              </span>
            </div>
            {errors.passwordExpiry && (
              <p className="field-error">{errors.passwordExpiry}</p>
            )}
          </Field>
          <Field label="Session Timeout">
            <div className="relative">
              <input
                type="number"
                min={5}
                max={240}
                className="field-input pr-20"
                value={form.sessionTimeout}
                onChange={(e) =>
                  updateField("sessionTimeout", Number(e.target.value))
                }
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Minutes
              </span>
            </div>
            {errors.sessionTimeout && (
              <p className="field-error">{errors.sessionTimeout}</p>
            )}
          </Field>
          <Field label="Maximum Login Attempts">
            <input
              type="number"
              min={3}
              max={10}
              className="field-input"
              value={form.maximumLoginAttempts}
              onChange={(e) =>
                updateField("maximumLoginAttempts", Number(e.target.value))
              }
            />
            {errors.maximumLoginAttempts && (
              <p className="field-error">{errors.maximumLoginAttempts}</p>
            )}
          </Field>
          <Field label="Multi-Factor Authentication">
            <Checkbox
              label="Enabled"
              checked={form.multiFactorAuthentication}
              onChange={(checked) =>
                updateField("multiFactorAuthentication", checked)
              }
            />
          </Field>
        </div>
      </SettingsSection>
      <SettingsSection icon={<Bell size={18} />} title="Notification Settings">
        <div className="flex flex-wrap gap-6">
          <Checkbox
            label="Email Notifications"
            checked={form.emailNotifications}
            onChange={(checked) => updateField("emailNotifications", checked)}
          />
          <Checkbox
            label="SMS Notifications"
            checked={form.smsNotifications}
            onChange={(checked) => updateField("smsNotifications", checked)}
          />
          <Checkbox
            label="Push Notifications"
            checked={form.pushNotifications}
            onChange={(checked) => updateField("pushNotifications", checked)}
          />
        </div>
      </SettingsSection>
      <SettingsSection icon={<Settings size={18} />} title="Platform Settings">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Maximum File Upload Size">
            <div className="relative">
              <input
                type="number"
                min={1}
                className="field-input pr-14"
                value={form.maximumFileUploadSize}
                onChange={(e) =>
                  updateField("maximumFileUploadSize", Number(e.target.value))
                }
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                MB
              </span>
            </div>
            {errors.maximumFileUploadSize && (
              <p className="field-error">{errors.maximumFileUploadSize}</p>
            )}
          </Field>
          <Field label="Default Theme">
            <select
              className="field-input"
              value={form.defaultTheme}
              onChange={(e) => updateField("defaultTheme", e.target.value)}
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System">System</option>
            </select>
          </Field>
          <Field label="Maintenance Mode">
            <Checkbox
              label={form.maintenanceMode ? "Enabled" : "Disabled"}
              checked={form.maintenanceMode}
              onChange={(checked) => updateField("maintenanceMode", checked)}
            />
          </Field>
        </div>
      </SettingsSection>
      <section className="panel p-5">
        <h3 className="text-sm font-extrabold text-slate-800">
          Configuration Information
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold text-slate-500">Last Updated By</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {form.lastUpdatedBy}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Last Updated On</p>
            <p className="mt-1 text-sm font-bold text-slate-900">
              {form.lastUpdatedOn}
            </p>
          </div>
        </div>
      </section>
      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            className="btn btn-primary whitespace-nowrap"
            onClick={handleSave}
            disabled={updateSettings.isPending}
          >
            <Save size={15} />
            {updateSettings.isPending ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-secondary whitespace-nowrap"
            onClick={handleReset}
            disabled={resetSettings.isPending}
          >
            <RotateCcw size={15} />
            Reset
          </button>
          <button
            type="button"
            className="btn btn-secondary whitespace-nowrap"
            onClick={handleRefresh}
            disabled={settingsQuery.isFetching}
          >
            <RefreshCw
              size={15}
              className={settingsQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </section>
    </div>
  );
}
function SettingsSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-5">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-blue-600">{icon}</span>
        <h3 className="text-sm font-extrabold text-slate-800">{title}</h3>
      </div>
      {children}
    </section>
  );
}
function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-[42px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-blue-600"
      />
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </label>
  );
}
