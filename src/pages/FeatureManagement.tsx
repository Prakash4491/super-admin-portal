import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Download,
  Eye,
  Filter,
  Power,
  RefreshCw,
  Search,
  Settings,
  XCircle,
} from "lucide-react";
import {
  useDisableFeature,
  useEnableFeature,
  useFeatures,
} from "../hooks/useFeatures";
export default function FeatureManagement() {
  const { data: features = [], isPending, refetch } = useFeatures();
  const enableMutation = useEnableFeature();
  const disableMutation = useDisableFeature();
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [planFilter, setPlanFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const filteredFeatures = useMemo(() => {
    return features.filter((feature) => {
      const matchesSearch = feature.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesModule =
        moduleFilter === "ALL" || feature.module === moduleFilter;
      const matchesPlan =
        planFilter === "ALL" || feature.licensePlan === planFilter;
      const matchesStatus =
        statusFilter === "ALL" || feature.status === statusFilter;
      return matchesSearch && matchesModule && matchesPlan && matchesStatus;
    });
  }, [features, search, moduleFilter, planFilter, statusFilter]);
  const totalFeatures = features.length;
  const enabledFeatures = features.filter(
    (feature) => feature.status === "ENABLED",
  ).length;
  const disabledFeatures = features.filter(
    (feature) => feature.status === "DISABLED",
  ).length;
  const modules = [...new Set(features.map((feature) => feature.module))];
  const plans = [...new Set(features.map((feature) => feature.licensePlan))];
  const handleToggle = (id: number, status: string) => {
    if (status === "ENABLED") {
      disableMutation.mutate(id);
    } else {
      enableMutation.mutate(id);
    }
  };
  const handleExport = () => {
    const headers = ["Feature Name", "Module", "License Plan", "Status"];
    const rows = features.map((feature) => [
      feature.name,
      feature.module,
      feature.licensePlan,
      feature.status,
    ]);
    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "feature-configuration.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  if (isPending) {
    return (
      <div className="py-20 text-center text-sm font-bold text-slate-500">
        Loading features...
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-extrabold tracking-tight text-red-500">
          FEATURE MANAGEMENT
        </h2>
        <p className="mt-1 text-sm font-extrabold text-black-500">
          Manage platform features across the enterprise application.
        </p>
      </section>
      <section className="panel p-5">
        <label className="field-label">Search Feature</label>
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search feature by name..."
            className="field-input pl-10"
          />
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-sm font-extrabold text-slate-800">
          Feature Summary
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard label="Total Features" value={totalFeatures} />
          <SummaryCard label="Enabled Features" value={enabledFeatures} />
          <SummaryCard label="Disabled Features" value={disabledFeatures} />
        </div>
      </section>
      <section className="panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={17} className="text-slate-500" />
          <h3 className="text-sm font-extrabold text-slate-800">Filters</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            value={moduleFilter}
            onChange={(event) => setModuleFilter(event.target.value)}
            className="field-input"
          >
            <option value="ALL">All Modules</option>
            {modules.map((module) => (
              <option key={module} value={module}>
                {module}
              </option>
            ))}
          </select>
          <select
            value={planFilter}
            onChange={(event) => setPlanFilter(event.target.value)}
            className="field-input"
          >
            <option value="ALL">All License Plans</option>
            {plans.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="field-input"
          >
            <option value="ALL">All Status</option>
            <option value="ENABLED">Enabled</option>
            <option value="DISABLED">Disabled</option>
          </select>
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">
              Feature List
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredFeatures.length} feature
              {filteredFeatures.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  Feature Name
                </th>
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  Module
                </th>
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  License Plan
                </th>
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFeatures.map((feature) => (
                <tr
                  key={feature.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-800">
                      {feature.name}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {feature.description}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {feature.module}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {feature.licensePlan}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={feature.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggle(feature.id, feature.status)}
                        className={
                          feature.status === "ENABLED"
                            ? "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                            : "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50"
                        }
                      >
                        <Power size={14} />
                        {feature.status === "ENABLED" ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                      >
                        <Settings size={14} />
                        Configure
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 p-4 md:hidden">
          {filteredFeatures.map((feature) => (
            <div
              key={feature.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-800">{feature.name}</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    {feature.description}
                  </p>
                </div>
                <StatusBadge status={feature.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="block font-bold text-slate-400">Module</span>
                  <span className="mt-1 block font-semibold text-slate-700">
                    {feature.module}
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-slate-400">
                    License Plan
                  </span>
                  <span className="mt-1 block font-semibold text-slate-700">
                    {feature.licensePlan}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleToggle(feature.id, feature.status)}
                  className={
                    feature.status === "ENABLED"
                      ? "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
                      : "inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-600"
                  }
                >
                  <Power size={14} />
                  {feature.status === "ENABLED" ? "Disable" : "Enable"}
                </button>
                <button
                  type="button"
                  className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600"
                >
                  <Settings size={14} />
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredFeatures.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-bold text-slate-500">
              No features found.
            </p>
          </div>
        )}
      </section>
      <section className="panel flex flex-row items-center justify-end gap-3 p-5">
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          <Download size={15} />
          Export
        </button>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-blue-700"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </section>
    </div>
  );
}
function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel p-5">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}
function StatusBadge({ status }: { status: "ENABLED" | "DISABLED" }) {
  if (status === "ENABLED") {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
        <CheckCircle2 size={13} />
        Enabled
      </span>
    );
  }
  return (
    <span className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-extrabold text-red-700">
      <XCircle size={13} />
      Disabled
    </span>
  );
}
