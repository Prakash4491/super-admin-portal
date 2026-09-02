import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateDataPermission,
  deactivateDataPermission,
  getDataPermission,
  getDataPermissions,
  updateDataPermission,
  createDataPermission,
} from "../services/dataPermissionService";
import type {
  DataPermission,
  DataPermissionScope,
  RecordOwnership,
} from "../types";
export type DataPermissionFormValues = {
  policyName: string;
  policyType: string;
  organization: string;
  organizationId: number;
  roleId: number;
  roleName: string;
  status: "ACTIVE" | "INACTIVE";
  scopes: DataPermissionScope[];
  department?: string;
  businessUnit?: string;
  branch?: string;
  project?: string;
  location?: string;
  customer?: string;
  vendor?: string;
  ownershipRules: RecordOwnership[];
  viewSubordinateRecords: boolean;
  approveSubordinateTransactions: boolean;
};
export const dataPermissionKeys = {
  all: ["dataPermissions"] as const,
  lists: () => [...dataPermissionKeys.all, "list"] as const,
  details: () => [...dataPermissionKeys.all, "detail"] as const,
  detail: (id: number) => [...dataPermissionKeys.details(), id] as const,
};
export function useDataPermissions() {
  return useQuery({
    queryKey: dataPermissionKeys.lists(),
    queryFn: getDataPermissions,
  });
}
export function useDataPermission(id: number) {
  return useQuery({
    queryKey: dataPermissionKeys.detail(id),
    queryFn: () => getDataPermission(id),
    enabled: Boolean(id),
  });
}
export function useCreateDataPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: DataPermissionFormValues) =>
      createDataPermission(values),
    onSuccess: (createdPolicy) => {
      queryClient.setQueryData(
        dataPermissionKeys.detail(createdPolicy.id),
        createdPolicy,
      );
      queryClient.invalidateQueries({
        queryKey: dataPermissionKeys.lists(),
      });
    },
  });
}
export function useUpdateDataPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (policy: DataPermission) => updateDataPermission(policy),
    onSuccess: (updatedPolicy) => {
      queryClient.setQueryData(
        dataPermissionKeys.detail(updatedPolicy.id),
        updatedPolicy,
      );
      queryClient.invalidateQueries({
        queryKey: dataPermissionKeys.lists(),
      });
    },
  });
}
export function useActivateDataPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateDataPermission,
    onSuccess: (updatedPolicy) => {
      queryClient.setQueryData(
        dataPermissionKeys.detail(updatedPolicy.id),
        updatedPolicy,
      );
      queryClient.invalidateQueries({
        queryKey: dataPermissionKeys.lists(),
      });
    },
  });
}
export function useDeactivateDataPermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateDataPermission,
    onSuccess: (updatedPolicy) => {
      queryClient.setQueryData(
        dataPermissionKeys.detail(updatedPolicy.id),
        updatedPolicy,
      );
      queryClient.invalidateQueries({
        queryKey: dataPermissionKeys.lists(),
      });
    },
  });
}
