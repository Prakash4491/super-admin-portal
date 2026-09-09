import { useRef, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Download,
  Eye,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import Loading from "../components/Loading";
import ErrorState from "../components/ErrorState";
import { useArchiveAuditLog, useAuditLogs } from "../hooks/useAuditLogs";
import type { AuditLog } from "../types";
export default function AuditLogs() {
  const auditLogs = useAuditLogs();
  const archiveMutation = useArchiveAuditLog();
  const [search, setSearch] = useState("");
  const [organization, setOrganization] = useState("");
  const [module, setModule] = useState("");
  const [eventType, setEventType] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };
  const [dateError, setDateError] = useState("");
  if (auditLogs.isPending) {
    return <Loading text="Loading audit logs..." />;
  }
  if (auditLogs.isError) {
    return <ErrorState error={auditLogs.error} onRetry={auditLogs.refetch} />;
  }
  const logs = auditLogs.data;
  const organizations = Array.from(
    new Set(logs.map((log) => log.organization)),
  );
  const modules = Array.from(new Set(logs.map((log) => log.module)));
  const eventTypes = Array.from(new Set(logs.map((log) => log.eventType)));
  const users = Array.from(new Set(logs.map((log) => log.performedBy)));
  const filteredLogs = logs.filter((log) => {
    const searchValue = search.trim().toLowerCase();
    const matchesSearch =
      !searchValue ||
      log.logId.toLowerCase().includes(searchValue) ||
      log.username.toLowerCase().includes(searchValue) ||
      log.module.toLowerCase().includes(searchValue) ||
      log.eventType.toLowerCase().includes(searchValue);
    const matchesOrganization =
      !organization || log.organization === organization;
    const matchesModule = !module || log.module === module;
    const matchesEvent = !eventType || log.eventType === eventType;
    const matchesUser = !performedBy || log.performedBy === performedBy;
    const matchesStatus = !status || log.status === status;
    return (
      matchesSearch &&
      matchesOrganization &&
      matchesModule &&
      matchesEvent &&
      matchesUser &&
      matchesStatus
    );
  });
  const handleFromDateChange = (value: string) => {
    setFromDate(value);
    if (toDate && value > toDate) {
      setDateError("'From' date must not be later than the 'To' date.");
    } else {
      setDateError("");
    }
  };
  const handleToDateChange = (value: string) => {
    setToDate(value);
    if (fromDate && fromDate > value) {
      setDateError("'From' date must not be later than the 'To' date.");
    } else {
      setDateError("");
    }
  };
  const handleExport = () => {
    const headers = [
      "Log ID",
      "Organization",
      "Module",
      "Event Type",
      "User",
      "Performed By",
      "Time",
      "IP Address",
      "Status",
      "Remarks",
    ];
    const rows = filteredLogs.map((log) => [
      log.logId,
      log.organization,
      log.module,
      log.eventType,
      log.username,
      log.performedBy,
      log.actionTime,
      log.ipAddress,
      log.status,
      log.remarks,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-logs-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const handleArchive = async (log: AuditLog) => {
    await archiveMutation.mutateAsync(log.id);
    if (selectedLog?.id === log.id) {
      setSelectedLog(null);
    }
  };
  const resetFilters = () => {
    setSearch("");
    setOrganization("");
    setModule("");
    setEventType("");
    setPerformedBy("");
    setStatus("");
    setFromDate("");
    setToDate("");
    setDateError("");
  };
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-extrabold tracking-tight text-red-500">
          AUDIT LOGS
        </h2>
        <p className="mt-1 text-sm font-extrabold text-black-500">
          Monitor and review platform audit activities.
        </p>
      </section>
      <section className="panel p-5">
        <SectionTitle title="Search Audit Logs" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by Log ID, Username, Module, Event..."
              className="field-input pl-9"
            />
          </div>
          <button
            type="button"
            className="btn btn-primary w-fit whitespace-nowrap"
          >
            <Search size={15} />
            Search
          </button>
        </div>
      </section>
      <section className="panel p-5">
        <SectionTitle title="Filters" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FilterSelect
            label="Organization"
            value={organization}
            onChange={setOrganization}
            options={organizations}
          />
          <FilterSelect
            label="Module"
            value={module}
            onChange={setModule}
            options={modules}
          />
          <FilterSelect
            label="Event Type"
            value={eventType}
            onChange={setEventType}
            options={eventTypes}
          />
          <FilterSelect
            label="Performed By"
            value={performedBy}
            onChange={setPerformedBy}
            options={users}
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={setStatus}
            options={["SUCCESS", "FAILED"]}
          />
          <div>
            <label className="field-label">Date Range</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={fromDate}
                onChange={(event) => handleFromDateChange(event.target.value)}
                className="field-input"
              />
              <input
                type="date"
                value={toDate}
                onChange={(event) => handleToDateChange(event.target.value)}
                className="field-input"
              />
            </div>
          </div>
        </div>
        {dateError && (
          <p className="mt-3 text-xs font-semibold text-red-600">{dateError}</p>
        )}
      </section>
      <section className="panel overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">
              Audit Log Records
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredLogs.length} filtered records.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={Boolean(dateError) || filteredLogs.length === 0}
            className="btn btn-secondary w-fit whitespace-nowrap disabled:opacity-50"
          >
            <Download size={15} />
            Export
          </button>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1000px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <TableHeader>Log ID</TableHeader>
                <TableHeader>Module</TableHeader>
                <TableHeader>Event Type</TableHeader>
                <TableHeader>User</TableHeader>
                <TableHeader>Time</TableHeader>
                <TableHeader>IP Address</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-slate-50 ${
                      log.archived ? "opacity-50" : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-sm font-bold">{log.logId}</td>
                    <td className="px-4 py-4 text-sm">{log.module}</td>
                    <td className="px-4 py-4 text-sm">{log.eventType}</td>
                    <td className="px-4 py-4 text-sm font-semibold">
                      {log.username}
                    </td>
                    <td className="px-4 py-4 text-sm">{log.time}</td>
                    <td className="px-4 py-4 text-sm font-mono">
                      {log.ipAddress}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => handleViewDetails(log)}
                        className="btn btn-secondary"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 p-4 md:hidden">
          {filteredLogs.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400">
              No audit logs found.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`rounded-xl border border-slate-200 p-4 ${
                  log.archived ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-slate-800">
                      {log.logId}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{log.module}</p>
                  </div>
                  <StatusBadge status={log.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <DetailItem label="Event" value={log.eventType} />
                  <DetailItem label="User" value={log.username} />
                  <DetailItem label="Time" value={log.time} />
                  <DetailItem label="IP Address" value={log.ipAddress} />
                </div>
                <button
                  type="button"
                  onClick={() => handleViewDetails(log)}
                  className="btn btn-secondary mt-4 w-fit whitespace-nowrap"
                >
                  <Eye size={14} />
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </section>
      {selectedLog && (
        <section ref={detailsRef} className="panel">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">
                Audit Log Details
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                Detailed information for {selectedLog.logId}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedLog(null)}
              className="rounded-lg px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
            <ReadonlyField label="Log ID" value={selectedLog.logId} />
            <ReadonlyField label="Module" value={selectedLog.module} />
            <ReadonlyField label="Event" value={selectedLog.eventType} />
            <ReadonlyField
              label="Performed By"
              value={selectedLog.performedBy}
            />
            <ReadonlyField label="Action Time" value={selectedLog.actionTime} />
            <ReadonlyField label="IP Address" value={selectedLog.ipAddress} />
            <div>
              <label className="field-label">Status</label>
              <StatusBadge status={selectedLog.status} />
            </div>
            <ReadonlyField
              label="Organization"
              value={selectedLog.organization}
            />
            <div className="md:col-span-2">
              <label className="field-label">Remarks</label>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                {selectedLog.remarks}
              </div>
            </div>
          </div>
        </section>
      )}
      <section className="panel p-5">
        <div className="flex flex-wrap items-center justify-end gap-3">
          {selectedLog && (
            <>
              <button
                type="button"
                onClick={() => setSelectedLog(selectedLog)}
                className="btn btn-secondary w-fit whitespace-nowrap"
              >
                <Eye size={15} />
                View Details
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="btn btn-secondary w-fit whitespace-nowrap"
              >
                <Download size={15} />
                Export
              </button>
              <button
                type="button"
                disabled={selectedLog.archived || archiveMutation.isPending}
                onClick={() => handleArchive(selectedLog)}
                className="btn btn-danger w-fit whitespace-nowrap disabled:opacity-50"
              >
                <Archive size={15} />
                {archiveMutation.isPending
                  ? "Archiving..."
                  : selectedLog.archived
                    ? "Archived"
                    : "Archive"}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => auditLogs.refetch()}
            className="btn btn-primary w-fit whitespace-nowrap"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </section>
      <section className="panel p-5">
        <h3 className="text-sm font-extrabold text-slate-800">
          Audit Information
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ReadonlyField label="Generated By" value="System" />
          <ReadonlyField label="Last Updated" value="08-Sep-2026 07:45 PM" />
        </div>
      </section>
      <section className="panel flex flex-row items-center justify-end gap-3 p-5">
        <button
          type="button"
          onClick={resetFilters}
          className="btn btn-secondary w-fit whitespace-nowrap"
        >
          Reset Filters
        </button>
        <button
          type="button"
          onClick={() => auditLogs.refetch()}
          className="btn btn-primary w-fit whitespace-nowrap"
        >
          Refresh
        </button>
      </section>
    </div>
  );
}
function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="mb-4 text-sm font-extrabold text-slate-800">{title}</h3>
  );
}
function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="field-input"
      >
        <option value="">All {label}s</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500">
      {children}
    </th>
  );
}
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-bold text-slate-400">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-700">{value}</p>
    </div>
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
function StatusBadge({ status }: { status: "SUCCESS" | "FAILED" }) {
  const success = status === "SUCCESS";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        success ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
      }`}
    >
      {success ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
      {success ? "Success" : "Failed"}
    </span>
  );
}
