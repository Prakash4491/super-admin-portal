import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Users, CalendarDays } from "lucide-react";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import { useOrganization } from "../hooks/useOrganizations";
export default function OrganizationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const organizationId = Number(id);
  const organization = useOrganization(organizationId);
  if (organization.isPending) {
    return <Loading text="Loading organization..." />;
  }
  if (organization.isError) {
    return (
      <ErrorState error={organization.error} onRetry={organization.refetch} />
    );
  }
  const data = organization.data;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/organizations")}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold">{data.name}</h2>
          <p className="mt-1 text-sm text-slate-500">Organization details</p>
        </div>
      </div>
      <section className="panel p-5">
        <h3 className="mb-5 text-sm font-extrabold">
          Organization Information
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem label="Organization Name" value={data.name} />
          <InfoItem label="Organization Code" value={data.code} />
          <InfoItem label="Tenant" value={data.tenantName} />
          <InfoItem label="Status" value={data.status} />
          <InfoItem label="Created" value={data.createdAt} />
          <InfoItem label="Users" value={String(data.users)} />
        </div>
        <div className="mt-5 border-t border-slate-100 pt-5">
          <span className="text-xs font-bold text-slate-400">Description</span>
          <p className="mt-1 text-sm text-slate-600">
            {data.description || "No description provided."}
          </p>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={<Users size={18} />}
          label="Total Users"
          value={data.users}
        />
        <StatCard
          icon={<Building2 size={18} />}
          label="Organization"
          value={data.name}
        />
        <StatCard
          icon={<CalendarDays size={18} />}
          label="Created"
          value={data.createdAt}
        />
      </section>
    </div>
  );
}
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-bold text-slate-400">{label}</span>
      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <section className="panel flex items-center gap-4 p-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <strong className="text-lg font-extrabold">{value}</strong>
      </div>
    </section>
  );
}
