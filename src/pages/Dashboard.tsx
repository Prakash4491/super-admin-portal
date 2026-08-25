import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Activity,
  Building2,
  CheckCircle2,
  PauseCircle,
  Users,
  ShieldCheck
} from "lucide-react";
import KpiCard from "../components/KpiCard";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import {
  useDashboardActivities,
  useDashboardAnalytics,
  useDashboardHealth,
  useDashboardKpis
} from "../hooks/useDashboard";

export default function Dashboard() {
  const kpis = useDashboardKpis();
  const health = useDashboardHealth();
  const analytics = useDashboardAnalytics();
  const activities = useDashboardActivities();

  if (kpis.isPending) return <Loading text="Loading dashboard..." />;
  if (kpis.isError) return <ErrorState error={kpis.error} onRetry={kpis.refetch} />;

  return (
    <div className="space-y-6">
      <PageHeading />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Total Tenants" value={kpis.data.totalTenants} hint="All registered tenants" icon={<Building2 size={18} />} />
        <KpiCard label="Active Tenants" value={kpis.data.activeTenants} hint="Currently enabled" icon={<CheckCircle2 size={18} />} />
        <KpiCard label="Inactive Tenants" value={kpis.data.inactiveTenants} hint="Currently disabled" icon={<PauseCircle size={18} />} />
        <KpiCard label="Total Users" value={kpis.data.totalUsers.toLocaleString()} hint="Across all tenants" icon={<Users size={18} />} />
        <KpiCard label="Active Licenses" value={kpis.data.activeLicenses} hint="Current subscriptions" icon={<ShieldCheck size={18} />} />
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <ChartPanel title="Tenant Growth" subtitle="Platform tenant growth over time" className="xl:col-span-2">
          {analytics.isPending ? <Loading /> : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.data.tenantGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="tenants" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartPanel>

        <ChartPanel title="Tenant Status" subtitle="Active vs inactive tenants">
          {analytics.isPending ? <Loading /> : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.data.statusBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" fontSize={10} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartPanel>

        <HealthCard
          loading={health.isPending}
          data={health.data}
        />

        <ActivitiesCard
          loading={activities.isPending}
          activities={activities.data ?? []}
        />
      </div>
    </div>
  );
}

function PageHeading() {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight">Global Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Monitor the health and activity of the entire platform.
        </p>
      </div>
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Live
      </span>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  children,
  className = ""
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel p-5 ${className}`}>
      <div className="mb-3">
        <h3 className="text-sm font-extrabold">{title}</h3>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function HealthCard({
  loading,
  data
}: {
  loading: boolean;
  data:
    | {
        apiGateway: string;
        database: string;
        server: string;
        storage: number;
        cpu: number;
        memory: number;
      }
    | undefined;
}) {
  return (
    <section className="panel">
      <div className="border-b border-line p-5">
        <h3 className="text-sm font-extrabold">Platform Health</h3>
        <p className="mt-1 text-xs text-slate-400">Current system status</p>
      </div>
      {loading || !data ? (
        <Loading />
      ) : (
        <div className="space-y-4 p-5">
          <HealthRow label="API Gateway" value={data.apiGateway} />
          <HealthRow label="Database" value={data.database} />
          <HealthRow label="Server" value={data.server} />
          <Progress label="Storage" value={data.storage} />
          <Progress label="CPU Usage" value={data.cpu} />
          <Progress label="Memory" value={data.memory} />
        </div>
      )}
    </section>
  );
}

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
      <span className="text-slate-500">{label}</span>
      <strong className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {value}
      </strong>
    </div>
  );
}

function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-[11px]">
        <span className="text-slate-500">{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-slate-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ActivitiesCard({
  loading,
  activities
}: {
  loading: boolean;
  activities: Array<{
    id: number;
    message: string;
    tenantName: string;
    time: string;
  }>;
}) {
  return (
    <section className="panel">
      <div className="border-b border-line p-5">
        <h3 className="text-sm font-extrabold">Recent Activities</h3>
        <p className="mt-1 text-xs text-slate-400">Latest platform events</p>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="divide-y divide-slate-100 px-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 py-4">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100">
                <Activity size={13} />
              </div>
              <div>
                <strong className="block text-xs">{activity.message}</strong>
                <span className="mt-1 block text-[11px] text-slate-400">
                  {activity.tenantName} · {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
