import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  XCircle,
  PauseCircle,
  RotateCcw,
} from "lucide-react";
import {
  useActivateLicense,
  useLicenses,
  useRenewLicense,
  useSuspendLicense,
} from "../hooks/useLicenses";
export default function LicenseManagement() {
  const { data: licenses = [], isPending, refetch } = useLicenses();
  const renewMutation = useRenewLicense();
  const suspendMutation = useSuspendLicense();
  const activateMutation = useActivateLicense();
  const [search, setSearch] = useState("");
  const [licenseTypeFilter, setLicenseTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [organizationFilter, setOrganizationFilter] = useState("ALL");
  const filteredLicenses = useMemo(() => {
    return licenses.filter((license) => {
      const searchValue = search.toLowerCase();
      const matchesSearch =
        license.licenseKey.toLowerCase().includes(searchValue) ||
        license.organization.toLowerCase().includes(searchValue);
      const matchesType =
        licenseTypeFilter === "ALL" ||
        license.licenseType === licenseTypeFilter;
      const matchesStatus =
        statusFilter === "ALL" || license.status === statusFilter;
      const matchesOrganization =
        organizationFilter === "ALL" ||
        license.organization === organizationFilter;
      return (
        matchesSearch && matchesType && matchesStatus && matchesOrganization
      );
    });
  }, [licenses, search, licenseTypeFilter, statusFilter, organizationFilter]);
  const totalLicenses = licenses.length;
  const activeLicenses = licenses.filter(
    (license) => license.status === "ACTIVE",
  ).length;
  const expiredLicenses = licenses.filter(
    (license) => license.status === "EXPIRED",
  ).length;
  const suspendedLicenses = licenses.filter(
    (license) => license.status === "SUSPENDED",
  ).length;
  const licenseTypes = [
    ...new Set(licenses.map((license) => license.licenseType)),
  ];
  const organizations = [
    ...new Set(licenses.map((license) => license.organization)),
  ];
  const handleRenew = (id: number) => {
    renewMutation.mutate(id);
  };
  const handleSuspend = (id: number) => {
    suspendMutation.mutate(id);
  };
  const handleActivate = (id: number) => {
    activateMutation.mutate(id);
  };
  const handleExport = () => {
    const headers = [
      "License Key",
      "Organization",
      "License Type",
      "Expiry Date",
      "Status",
    ];
    const rows = licenses.map((license) => [
      license.licenseKey,
      license.organization,
      license.licenseType,
      license.expiryDate,
      license.status,
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
    link.download = "license-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  if (isPending) {
    return (
      <div className="py-20 text-center text-sm font-bold text-slate-500">
        Loading licenses...
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-extrabold tracking-tight text-red-500">
          LICENSE MANAGEMENT
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Manage software licenses across tenants and organizations.
        </p>
      </section>
      <section className="panel p-5">
        <label className="field-label">Search License / Organization</label>
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by license key or organization..."
            className="field-input pl-10"
          />
        </div>
      </section>
      <section>
        <h3 className="mb-3 text-sm font-extrabold text-slate-800">
          License Summary
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Licenses" value={totalLicenses} />
          <SummaryCard label="Active Licenses" value={activeLicenses} />
          <SummaryCard label="Expired Licenses" value={expiredLicenses} />
          <SummaryCard label="Suspended Licenses" value={suspendedLicenses} />
        </div>
      </section>
      <section className="panel p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={17} className="text-slate-500" />
          <h3 className="text-sm font-extrabold text-slate-800">Filters</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            value={licenseTypeFilter}
            onChange={(event) => setLicenseTypeFilter(event.target.value)}
            className="field-input"
          >
            <option value="ALL">All License Types</option>
            {licenseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="field-input"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRING">Expiring</option>
            <option value="EXPIRED">Expired</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <select
            value={organizationFilter}
            onChange={(event) => setOrganizationFilter(event.target.value)}
            className="field-input"
          >
            <option value="ALL">All Organizations</option>
            {organizations.map((organization) => (
              <option key={organization} value={organization}>
                {organization}
              </option>
            ))}
          </select>
        </div>
      </section>
      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">
              License List
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {filteredLicenses.length} license
              {filteredLicenses.length !== 1 ? "s" : ""} found
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
                  License Key
                </th>
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  Organization
                </th>
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  Plan
                </th>
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  Expiry Date
                </th>
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-extrabold text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLicenses.map((license) => (
                <tr
                  key={license.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-5 py-4 text-sm font-bold text-slate-800">
                    {license.licenseKey}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {license.organization}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {license.licenseType}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays size={15} />
                      {license.expiryDate}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={license.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {license.status !== "EXPIRED" &&
                        license.status !== "SUSPENDED" && (
                          <button
                            type="button"
                            onClick={() => handleRenew(license.id)}
                            className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50"
                          >
                            <RotateCcw size={14} />
                            Renew
                          </button>
                        )}
                      {license.status === "ACTIVE" ||
                      license.status === "EXPIRING" ? (
                        <button
                          type="button"
                          onClick={() => handleSuspend(license.id)}
                          className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          <PauseCircle size={14} />
                          Suspend
                        </button>
                      ) : null}
                      {license.status === "SUSPENDED" ||
                      license.status === "EXPIRED" ? (
                        <button
                          type="button"
                          onClick={() => handleActivate(license.id)}
                          className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50"
                        >
                          <ShieldCheck size={14} />
                          Activate
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 p-4 md:hidden">
          {filteredLicenses.map((license) => (
            <div
              key={license.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-800">
                    {license.licenseKey}
                  </h4>
                  <p className="mt-1 text-xs text-slate-500">
                    {license.organization}
                  </p>
                </div>
                <StatusBadge status={license.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-[11px] font-bold text-slate-400">
                    License Type
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-700">
                    {license.licenseType}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] font-bold text-slate-400">
                    Expiry Date
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-slate-700">
                    {license.expiryDate}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {license.status !== "EXPIRED" &&
                  license.status !== "SUSPENDED" && (
                    <button
                      type="button"
                      onClick={() => handleRenew(license.id)}
                      className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-600"
                    >
                      <RotateCcw size={14} />
                      Renew
                    </button>
                  )}
                {license.status === "ACTIVE" ||
                license.status === "EXPIRING" ? (
                  <button
                    type="button"
                    onClick={() => handleSuspend(license.id)}
                    className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
                  >
                    <PauseCircle size={14} />
                    Suspend
                  </button>
                ) : null}
                {license.status === "SUSPENDED" ||
                license.status === "EXPIRED" ? (
                  <button
                    type="button"
                    onClick={() => handleActivate(license.id)}
                    className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-lg border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-600"
                  >
                    <ShieldCheck size={14} />
                    Activate
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        {filteredLicenses.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-bold text-slate-500">
              No licenses found.
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
          Export Report
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
function StatusBadge({
  status,
}: {
  status: "ACTIVE" | "EXPIRING" | "EXPIRED" | "SUSPENDED";
}) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
        <CheckCircle2 size={13} />
        Active
      </span>
    );
  }
  if (status === "EXPIRING") {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-700">
        <CalendarDays size={13} />
        Expiring
      </span>
    );
  }
  if (status === "SUSPENDED") {
    return (
      <span className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-extrabold text-orange-700">
        <PauseCircle size={13} />
        Suspended
      </span>
    );
  }
  return (
    <span className="inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-extrabold text-red-700">
      <XCircle size={13} />
      Expired
    </span>
  );
}
