import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateTenant,
  createTenant,
  deactivateTenant,
  getTenant,
  getTenantStats,
  getTenants,
  updateTenant,
} from "../services/tenantService";
import type { TenantFormValues, TenantListParams } from "../types";
export const tenantKeys = {
  all: ["tenants"] as const,
  lists: () => [...tenantKeys.all, "list"] as const,
  list: (params: TenantListParams) => [...tenantKeys.lists(), params] as const,
  details: () => [...tenantKeys.all, "detail"] as const,
  detail: (id: number) => [...tenantKeys.details(), id] as const,
  stats: (id: number) => [...tenantKeys.all, "stats", id] as const,
};
export function useTenants(params: TenantListParams) {
  return useQuery({
    queryKey: tenantKeys.list(params),
    queryFn: () => getTenants(params),
    placeholderData: (previous) => previous,
  });
}
export function useTenant(id: number) {
  return useQuery({
    queryKey: tenantKeys.detail(id),
    queryFn: () => getTenant(id),
    enabled: Boolean(id),
  });
}
export function useTenantStats(id: number) {
  return useQuery({
    queryKey: tenantKeys.stats(id),
    queryFn: () => getTenantStats(id),
    enabled: Boolean(id),
  });
}
export function useCreateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: TenantFormValues) => createTenant(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
export function useUpdateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: Omit<TenantFormValues, "code">;
    }) => updateTenant(id, values),
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(
        tenantKeys.detail(updatedTenant.id),
        updatedTenant,
      );
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
export function useActivateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateTenant,
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(
        tenantKeys.detail(updatedTenant.id),
        updatedTenant,
      );
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.stats(updatedTenant.id),
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
export function useDeactivateTenant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateTenant,
    onSuccess: (updatedTenant) => {
      queryClient.setQueryData(
        tenantKeys.detail(updatedTenant.id),
        updatedTenant,
      );
      queryClient.invalidateQueries({ queryKey: tenantKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: tenantKeys.stats(updatedTenant.id),
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "activities"],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
