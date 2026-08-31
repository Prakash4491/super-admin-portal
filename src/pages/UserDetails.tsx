import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  Shield,
  UserRound,
  XCircle,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";

import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";

import { useActivateUser, useDeactivateUser, useUser } from "../hooks/useUsers";

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
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <h2 className="text-2xl font-extrabold">User Details</h2>

            <p className="mt-1 text-sm text-slate-500">
              View and manage user information.
            </p>
          </div>
        </div>
      </div>

      {/* User Profile */}

      <section className="panel p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
            <UserRound size={28} />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-extrabold">{data.name}</h3>

            <p className="mt-1 text-sm text-slate-500">{data.email}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <RoleBadge role={data.role} />

              <StatusBadge status={data.status} />
            </div>
          </div>
        </div>
      </section>

      {/* Information Cards */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Contact */}

        <InfoCard title="Contact Information">
          <InfoRow icon={<Mail size={16} />} label="Email" value={data.email} />

          <InfoRow
            icon={<Phone size={16} />}
            label="Phone"
            value={data.phone}
          />
        </InfoCard>

        {/* Organization */}

        <InfoCard title="Organization">
          <InfoRow
            icon={<Building2 size={16} />}
            label="Tenant"
            value={data.tenantName}
          />

          <InfoRow
            icon={<Building2 size={16} />}
            label="Organization"
            value={data.organizationName}
          />
        </InfoCard>

        {/* Access */}

        <InfoCard title="Access">
          <InfoRow icon={<Shield size={16} />} label="Role" value={data.role} />

          <InfoRow
            icon={<Shield size={16} />}
            label="Status"
            value={data.status}
          />
        </InfoCard>

        {/* Activity */}

        <InfoCard title="Activity">
          <InfoRow
            icon={<UserRound size={16} />}
            label="Last Login"
            value={data.lastLogin}
          />

          <InfoRow
            icon={<UserRound size={16} />}
            label="Created"
            value={data.createdAt}
          />
        </InfoCard>
      </div>

      {/* Account Status */}

      <section className="panel flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-extrabold">Account Status</h3>

          <p className="mt-1 text-xs text-slate-400">
            Enable or disable this user's account.
          </p>
        </div>

        {data.status === "ACTIVE" ? (
          <button
            type="button"
            disabled={deactivateMutation.isPending}
            onClick={async () => {
              await deactivateMutation.mutateAsync(data.id);

              user.refetch();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle size={15} />
            Deactivate User
          </button>
        ) : (
          <button
            type="button"
            disabled={activateMutation.isPending}
            onClick={async () => {
              await activateMutation.mutateAsync(data.id);

              user.refetch();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 px-4 py-2.5 text-xs font-bold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
          >
            <CheckCircle2 size={15} />
            Activate User
          </button>
        )}
      </section>
    </div>
  );
}

/* =====================================================
   INFO CARD
===================================================== */

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel">
      <div className="border-b border-slate-200 p-5">
        <h3 className="text-sm font-extrabold">{title}</h3>
      </div>

      <div className="divide-y divide-slate-100 px-5">{children}</div>
    </section>
  );
}

/* =====================================================
   INFO ROW
===================================================== */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
        {icon}
      </div>

      <div>
        <span className="block text-[11px] text-slate-400">{label}</span>

        <strong className="mt-0.5 block text-sm">{value}</strong>
      </div>
    </div>
  );
}

/* =====================================================
   ROLE BADGE
===================================================== */

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-bold text-blue-700">
      <Shield size={12} />

      {role}
    </span>
  );
}

/* =====================================================
   STATUS BADGE
===================================================== */

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
