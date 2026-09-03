import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Edit3,
  KeyRound,
  Mail,
  Phone,
  RotateCcw,
  Shield,
  UserRound,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import { useActivateUser, useDeactivateUser, useUser } from "../hooks/useUsers";
import { initialTenants } from "../data/tenants";
import { initialOrganizations } from "../data/organizations";
export default function UserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = Number(id);
  const user = useUser(userId);
  const activateMutation = useActivateUser();
  const deactivateMutation = useDeactivateUser();
  if (user.isPending) {
    return <Loading text="Loading user..." />;
  }
  if (user.isError) {
    return <ErrorState error={user.error} onRetry={user.refetch} />;
  }
  const data = user.data;
  if (!data) {
    return (
      <div className="panel p-8 text-center">
        <p className="text-sm font-semibold text-slate-500">User not found.</p>
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="btn btn-primary mt-4"
        >
          Back to Users
        </button>
      </div>
    );
  }
  const tenant = initialTenants.find((item) => item.id === data.tenantId);
  const organization = initialOrganizations.find(
    (item) => item.id === data.organizationId,
  );
  const isActive = data.status === "ACTIVE";
  const firstName = data.name.trim().split(" ")[0] ?? "";
  const lastName = data.name.trim().split(" ").slice(1).join(" ");
  const username = data.email.split("@")[0];
  return (
    <div className="space-y-6">
      {}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50"
            title="Back to users"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-red-500">
              USER DETAILS
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              View and manage individual user information.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="btn btn-secondary w-fit whitespace-nowrap"
          >
            Back to User List
          </button>
          <button
            type="button"
            className="btn btn-primary w-fit whitespace-nowrap"
            onClick={() => {
              alert("Edit this user from the User List.");
            }}
          >
            <Edit3 size={15} />
            Edit User
          </button>
        </div>
      </section>
      {}
      <section className="panel p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
              <UserRound size={28} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {data.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{data.email}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <RoleBadge role={data.role} />
                <StatusBadge status={data.status} />
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-bold text-slate-400">Employee ID</p>
            <p className="mt-1 text-lg font-extrabold text-slate-800">
              EMP{String(data.id).padStart(3, "0")}
            </p>
          </div>
        </div>
      </section>
      {}
      <section className="panel p-5">
        <SectionTitle icon={<UserRound size={16} />} title="User Information" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadonlyField label="First Name" value={firstName} />
          <ReadonlyField label="Last Name" value={lastName || "User"} />
          <ReadonlyField
            label="Employee ID"
            value={`EMP${String(data.id).padStart(3, "0")}`}
          />
          <ReadonlyField label="Email Address" value={data.email} />
          <ReadonlyField
            label="Mobile Number"
            value={data.phone || "Not provided"}
          />
        </div>
      </section>
      {}
      <section className="panel p-5">
        <SectionTitle
          icon={<Building2 size={16} />}
          title="Organization Details"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadonlyField
            label="Tenant"
            value={tenant?.name ?? data.tenantName ?? "Not assigned"}
          />
          <ReadonlyField
            label="Organization"
            value={
              organization?.name ?? data.organizationName ?? "Not assigned"
            }
          />
          <ReadonlyField label="Business Unit" value="Technology Division" />
          <ReadonlyField label="Department" value="Information Technology" />
          <ReadonlyField label="Branch" value="Hyderabad" />
        </div>
      </section>
      {}
      <section className="panel p-5">
        <SectionTitle icon={<Shield size={16} />} title="Access Information" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadonlyField label="Username" value={username} />
          <ReadonlyField label="Role" value={formatRole(data.role)} />
          <ReadonlyField label="Reporting Manager" value="Select Employee" />
        </div>
      </section>
      {}
      <section className="panel p-5">
        <SectionTitle icon={<Shield size={16} />} title="Account Status" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {}
          <div>
            <p className="field-label">Status</p>
            <div className="flex items-center gap-5">
              <label
                className={`flex items-center gap-2 text-sm font-semibold ${
                  isActive ? "text-emerald-700" : "text-slate-400"
                }`}
              >
                <input type="radio" checked={isActive} readOnly />
                Active
              </label>
              <label
                className={`flex items-center gap-2 text-sm font-semibold ${
                  !isActive ? "text-red-700" : "text-slate-400"
                }`}
              >
                <input type="radio" checked={!isActive} readOnly />
                Inactive
              </label>
            </div>
          </div>
          {}
          <VerificationStatus label="Email Verification" verified />
          {}
          <VerificationStatus label="Mobile Verification" verified />
        </div>
      </section>
      {}
      <section className="panel p-5">
        <SectionTitle icon={<RotateCcw size={16} />} title="Account Activity" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadonlyField label="Last Login" value={data.lastLogin || "Never"} />
          <ReadonlyField
            label="Created On"
            value={data.createdAt || "Not available"}
          />
        </div>
      </section>
      {}
      <section className="panel p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">
              Account Actions
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Manage the selected user's account.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {}
            <button
              type="button"
              onClick={() =>
                alert(`Password reset initiated for ${data.email}`)
              }
              className="btn btn-secondary w-fit whitespace-nowrap"
            >
              <KeyRound size={15} />
              Reset Password
            </button>
            {}
            {isActive ? (
              <button
                type="button"
                disabled={deactivateMutation.isPending}
                onClick={async () => {
                  await deactivateMutation.mutateAsync(data.id);
                  user.refetch();
                }}
                className="btn btn-danger w-fit whitespace-nowrap disabled:opacity-50"
              >
                <XCircle size={15} />
                {deactivateMutation.isPending
                  ? "Deactivating..."
                  : "Deactivate User"}
              </button>
            ) : (
              <button
                type="button"
                disabled={activateMutation.isPending}
                onClick={async () => {
                  await activateMutation.mutateAsync(data.id);
                  user.refetch();
                }}
                className="btn btn-success w-fit whitespace-nowrap disabled:opacity-50"
              >
                <CheckCircle2 size={15} />
                {activateMutation.isPending ? "Activating..." : "Activate User"}
              </button>
            )}
          </div>
        </div>
      </section>
      {}
      <section className="panel flex flex-row items-center justify-end gap-3 p-5">
        <button
          type="button"
          onClick={() => navigate("/users")}
          className="btn btn-secondary w-fit whitespace-nowrap"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => user.refetch()}
          className="btn btn-primary w-fit whitespace-nowrap"
        >
          Refresh
        </button>
      </section>
    </div>
  );
}
function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-800">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </span>
      {title}
    </h3>
  );
}
function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="field-input bg-slate-50 text-slate-700">{value}</div>
    </div>
  );
}
function VerificationStatus({
  label,
  verified,
}: {
  label: string;
  verified: boolean;
}) {
  return (
    <div>
      <p className="field-label">{label}</p>
      <div
        className={`flex items-center gap-2 text-sm font-semibold ${
          verified ? "text-emerald-700" : "text-red-600"
        }`}
      >
        {verified ? <CheckCircle2 size={17} /> : <XCircle size={17} />}
        {verified ? "Verified" : "Not Verified"}
      </div>
    </div>
  );
}
function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
      <Shield size={12} />
      {formatRole(role)}
    </span>
  );
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
function formatRole(role: string) {
  if (role === "ADMIN") {
    return "Administrator";
  }
  if (role === "MANAGER") {
    return "Manager";
  }
  return "Executive";
}
