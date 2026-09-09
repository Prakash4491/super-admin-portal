import { initialAuditLogs } from "../data/auditLogs";
import type { AuditLog } from "../types";
let auditLogs: AuditLog[] = structuredClone(initialAuditLogs);
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
export async function getAuditLogs(): Promise<AuditLog[]> {
  await delay();
  return structuredClone(auditLogs);
}
export async function archiveAuditLog(id: number): Promise<AuditLog> {
  await delay();
  const index = auditLogs.findIndex((log) => log.id === id);
  if (index === -1) {
    throw new Error("Audit log not found.");
  }
  auditLogs[index] = {
    ...auditLogs[index],
    archived: true,
  };
  return structuredClone(auditLogs[index]);
}
