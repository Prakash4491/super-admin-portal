import {
  CheckCircle2,
  Globe,
  KeyRound,
  Languages,
  Mail,
  RotateCcw,
  Save,
  Server,
  Settings,
  Smartphone,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { initialPlatformConfiguration } from "../data/platformConfiguration";
import type {
  APIGatewayConfiguration,
  PlatformConfiguration as PlatformConfigurationType,
  SMSGatewayConfiguration,
  SMTPConfiguration,
} from "../types";
type ModalType = "smtp" | "sms" | "api" | null;
export default function PlatformConfiguration() {
  const [configuration, setConfiguration] = useState<PlatformConfigurationType>(
    structuredClone(initialPlatformConfiguration),
  );
  const [modal, setModal] = useState<ModalType>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!saved) {
      return;
    }
    const timer = setTimeout(() => {
      setSaved(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [saved]);
  function updateField(
    field:
      | "platformName"
      | "platformUrl"
      | "defaultTimeZone"
      | "defaultLanguage",
    value: string,
  ) {
    setConfiguration((current) => ({
      ...current,
      [field]: value,
    }));
    setSaved(false);
    setError("");
  }
  function validateConfiguration() {
    if (!configuration.platformName.trim()) {
      return "Platform name is required.";
    }
    if (!configuration.platformUrl.trim()) {
      return "Platform URL is required.";
    }
    try {
      new URL(configuration.platformUrl);
    } catch {
      return "Please enter a valid platform URL.";
    }
    if (!configuration.defaultTimeZone) {
      return "Default time zone is required.";
    }
    if (!configuration.defaultLanguage) {
      return "Default language is required.";
    }
    return "";
  }
  function handleSave() {
    const validationError = validateConfiguration();
    if (validationError) {
      setError(validationError);
      setSaved(false);
      return;
    }
    setConfiguration((current) => ({
      ...current,
      version: current.version + 1,
      lastModified: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      modifiedBy: "Super Admin",
    }));
    setSaved(true);
    setError("");
  }
  function handleReset() {
    setConfiguration(structuredClone(initialPlatformConfiguration));
    setSaved(false);
    setError("");
  }
  function saveSMTP(smtp: SMTPConfiguration) {
    setConfiguration((current) => ({
      ...current,
      smtp,
    }));
    setModal(null);
    setSaved(false);
  }
  function saveSMS(smsGateway: SMSGatewayConfiguration) {
    setConfiguration((current) => ({
      ...current,
      smsGateway,
    }));
    setModal(null);
    setSaved(false);
  }
  function saveAPI(apiGateway: APIGatewayConfiguration) {
    setConfiguration((current) => ({
      ...current,
      apiGateway,
    }));
    setModal(null);
    setSaved(false);
  }
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-red-500">
            PLATFORM CONFIGURATION
          </h2>
        </div>
        <p className="mt-1 text-sm font-extrabold text-slate-700">
          Configure global platform settings that affect all tenants and
          products.
        </p>
      </div>
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={17} />
          Platform configuration updated successfully.
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </div>
      )}
      <section className="panel">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-blue-600" />
            <h3 className="text-sm font-extrabold">Platform Configuration</h3>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Manage platform-wide settings.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
          <FormField label="Platform Name">
            <input
              type="text"
              value={configuration.platformName}
              onChange={(event) =>
                updateField("platformName", event.target.value)
              }
              className={inputClass}
              placeholder="Enter platform name"
            />
          </FormField>
          <FormField label="Platform URL">
            <input
              type="url"
              value={configuration.platformUrl}
              onChange={(event) =>
                updateField("platformUrl", event.target.value)
              }
              className={inputClass}
              placeholder="https://example.com"
            />
          </FormField>
          <FormField label="Default Time Zone">
            <select
              value={configuration.defaultTimeZone}
              onChange={(event) =>
                updateField("defaultTimeZone", event.target.value)
              }
              className={inputClass}
            >
              <option value="UTC +05:30">UTC +05:30</option>
              <option value="UTC +00:00">UTC +00:00</option>
              <option value="UTC +01:00">UTC +01:00</option>
              <option value="UTC +05:00">UTC +05:00</option>
              <option value="UTC +08:00">UTC +08:00</option>
              <option value="UTC -05:00">UTC -05:00</option>
              <option value="UTC -08:00">UTC -08:00</option>
            </select>
          </FormField>
          <FormField label="Default Language">
            <select
              value={configuration.defaultLanguage}
              onChange={(event) =>
                updateField("defaultLanguage", event.target.value)
              }
              className={inputClass}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Hindi">Hindi</option>
            </select>
          </FormField>
        </div>
      </section>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ConfigurationCard
          title="SMTP Configuration"
          description="Configure the email server."
          icon={<Mail size={20} />}
          configured={configuration.smtp.configured}
          onConfigure={() => setModal("smtp")}
        />
        <ConfigurationCard
          title="SMS Gateway"
          description="Configure the SMS gateway."
          icon={<Smartphone size={20} />}
          configured={configuration.smsGateway.configured}
          onConfigure={() => setModal("sms")}
        />
        <ConfigurationCard
          title="API Gateway"
          description="Configure API endpoints."
          icon={<Server size={20} />}
          configured={configuration.apiGateway.configured}
          onConfigure={() => setModal("api")}
        />
      </div>
      <section className="panel">
        <div className="border-b border-slate-200 p-5">
          <h3 className="text-sm font-extrabold">Configuration Information</h3>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3">
          <InfoItem
            label="Configuration Version"
            value={`v${configuration.version}`}
          />
          <InfoItem label="Last Modified" value={configuration.lastModified} />
          <InfoItem label="Modified By" value={configuration.modifiedBy} />
        </div>
      </section>
      <section className="panel flex flex-row items-center justify-end gap-3 p-5">
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex w-fit whitespace-nowrap items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          <RotateCcw size={15} />
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="inline-flex w-fit whitespace-nowrap items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-blue-700"
        >
          <Save size={15} />
          Save
        </button>
      </section>
      {modal === "smtp" && (
        <SMTPModal
          initial={configuration.smtp}
          onClose={() => setModal(null)}
          onSave={saveSMTP}
        />
      )}
      {modal === "sms" && (
        <SMSModal
          initial={configuration.smsGateway}
          onClose={() => setModal(null)}
          onSave={saveSMS}
        />
      )}
      {modal === "api" && (
        <APIModal
          initial={configuration.apiGateway}
          onClose={() => setModal(null)}
          onSave={saveAPI}
        />
      )}
    </div>
  );
}
function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-600">
        {label}
      </label>
      {children}
    </div>
  );
}
function ConfigurationCard({
  title,
  description,
  icon,
  configured,
  onConfigure,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  configured: boolean;
  onConfigure: () => void;
}) {
  return (
    <section className="panel p-5">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-extrabold">{title}</h3>
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
            configured
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {configured ? "Configured" : "Not Configured"}
        </span>
        <button
          type="button"
          onClick={onConfigure}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          Configure
        </button>
      </div>
    </section>
  );
}
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-slate-400">{label}</span>
      <strong className="mt-1 block text-sm">{value}</strong>
    </div>
  );
}
function Modal({
  title,
  children,
  onClose,
  onSave,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-lg font-extrabold">{title}</h3>
            <p className="mt-1 text-xs text-slate-400">
              Configure platform integration.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-5 p-5">{children}</div>
        <div className="flex justify-end gap-3 border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-blue-700"
          >
            <Save size={15} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
function SMTPModal({
  initial,
  onClose,
  onSave,
}: {
  initial: SMTPConfiguration;
  onClose: () => void;
  onSave: (value: SMTPConfiguration) => void;
}) {
  const [form, setForm] = useState(initial);
  return (
    <Modal
      title="SMTP Configuration"
      onClose={onClose}
      onSave={() =>
        onSave({
          ...form,
          configured: true,
        })
      }
    >
      <FormField label="SMTP Host">
        <input
          value={form.host}
          onChange={(event) =>
            setForm({
              ...form,
              host: event.target.value,
            })
          }
          className={inputClass}
          placeholder="smtp.example.com"
        />
      </FormField>
      <FormField label="SMTP Port">
        <input
          type="number"
          value={form.port}
          onChange={(event) =>
            setForm({
              ...form,
              port: Number(event.target.value),
            })
          }
          className={inputClass}
        />
      </FormField>
      <FormField label="Username">
        <input
          value={form.username}
          onChange={(event) =>
            setForm({
              ...form,
              username: event.target.value,
            })
          }
          className={inputClass}
        />
      </FormField>
      <FormField label="Password">
        <input
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm({
              ...form,
              password: event.target.value,
            })
          }
          className={inputClass}
        />
      </FormField>
    </Modal>
  );
}
function SMSModal({
  initial,
  onClose,
  onSave,
}: {
  initial: SMSGatewayConfiguration;
  onClose: () => void;
  onSave: (value: SMSGatewayConfiguration) => void;
}) {
  const [form, setForm] = useState(initial);
  return (
    <Modal
      title="SMS Gateway"
      onClose={onClose}
      onSave={() =>
        onSave({
          ...form,
          configured: true,
        })
      }
    >
      <FormField label="Provider">
        <input
          value={form.provider}
          onChange={(event) =>
            setForm({
              ...form,
              provider: event.target.value,
            })
          }
          className={inputClass}
          placeholder="Twilio"
        />
      </FormField>
      <FormField label="Gateway Endpoint">
        <input
          value={form.endpoint}
          onChange={(event) =>
            setForm({
              ...form,
              endpoint: event.target.value,
            })
          }
          className={inputClass}
          placeholder="https://sms.example.com"
        />
      </FormField>
      <FormField label="API Key">
        <input
          type="password"
          value={form.apiKey}
          onChange={(event) =>
            setForm({
              ...form,
              apiKey: event.target.value,
            })
          }
          className={inputClass}
        />
      </FormField>
    </Modal>
  );
}
function APIModal({
  initial,
  onClose,
  onSave,
}: {
  initial: APIGatewayConfiguration;
  onClose: () => void;
  onSave: (value: APIGatewayConfiguration) => void;
}) {
  const [form, setForm] = useState(initial);
  return (
    <Modal
      title="API Gateway"
      onClose={onClose}
      onSave={() =>
        onSave({
          ...form,
          configured: true,
        })
      }
    >
      <FormField label="Base URL">
        <input
          value={form.baseUrl}
          onChange={(event) =>
            setForm({
              ...form,
              baseUrl: event.target.value,
            })
          }
          className={inputClass}
          placeholder="https://api.example.com"
        />
      </FormField>
      <FormField label="Timeout (seconds)">
        <input
          type="number"
          value={form.timeout}
          onChange={(event) =>
            setForm({
              ...form,
              timeout: Number(event.target.value),
            })
          }
          className={inputClass}
        />
      </FormField>
    </Modal>
  );
}
const inputClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500";
