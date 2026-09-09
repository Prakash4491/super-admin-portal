import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { archiveAuditLog, getAuditLogs } from "../services/auditLogService";
export const auditLogKeys = {
  all: ["auditLogs"] as const,
  list: () => [...auditLogKeys.all, "list"] as const,
};
export function useAuditLogs() {
  return useQuery({
    queryKey: auditLogKeys.list(),
    queryFn: getAuditLogs,
  });
}
export function useArchiveAuditLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveAuditLog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: auditLogKeys.list(),
      });
    },
  });
}
