import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activatePermission,
  createPermission,
  deactivatePermission,
  getPermission,
  getPermissions,
  updatePermission,
} from "../services/permissionService";
import type { PermissionFormValues, PermissionListParams } from "../types";
export const permissionKeys = {
  all: ["permissions"] as const,
  lists: () => [...permissionKeys.all, "list"] as const,
  list: (params: PermissionListParams) =>
    [...permissionKeys.lists(), params] as const,
  details: () => [...permissionKeys.all, "detail"] as const,
  detail: (id: number) => [...permissionKeys.details(), id] as const,
};
export function usePermissions(params: PermissionListParams) {
  return useQuery({
    queryKey: permissionKeys.list(params),
    queryFn: () => getPermissions(params),
    placeholderData: (previous) => previous,
  });
}
export function usePermission(id: number) {
  return useQuery({
    queryKey: permissionKeys.detail(id),
    queryFn: () => getPermission(id),
    enabled: Boolean(id),
  });
}
export function useCreatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: PermissionFormValues) => createPermission(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: permissionKeys.all,
      });
    },
  });
}
export function useUpdatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: PermissionFormValues;
    }) => updatePermission(id, values),
    onSuccess: (updatedPermission) => {
      queryClient.setQueryData(
        permissionKeys.detail(updatedPermission.id),
        updatedPermission,
      );
      queryClient.invalidateQueries({
        queryKey: permissionKeys.lists(),
      });
    },
  });
}
export function useActivatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activatePermission,
    onSuccess: (updatedPermission) => {
      queryClient.setQueryData(
        permissionKeys.detail(updatedPermission.id),
        updatedPermission,
      );
      queryClient.invalidateQueries({
        queryKey: permissionKeys.lists(),
      });
    },
  });
}
export function useDeactivatePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivatePermission,
    onSuccess: (updatedPermission) => {
      queryClient.setQueryData(
        permissionKeys.detail(updatedPermission.id),
        updatedPermission,
      );
      queryClient.invalidateQueries({
        queryKey: permissionKeys.lists(),
      });
    },
  });
}
