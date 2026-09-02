import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateRole,
  createRole,
  deactivateRole,
  getRole,
  getRoles,
  updateRole,
  updateRolePermissions,
} from "../services/roleService";
import type { RoleFormValues, RoleListParams } from "../types";
export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  list: (params: RoleListParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: number) => [...roleKeys.details(), id] as const,
};
export function useRoles(params: RoleListParams) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => getRoles(params),
    placeholderData: (previous) => previous,
  });
}
export function useRole(id: number) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => getRole(id),
    enabled: Boolean(id),
  });
}
export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: RoleFormValues) => createRole(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.all,
      });
    },
  });
}
export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: RoleFormValues }) =>
      updateRole(id, values),
    onSuccess: (updatedRole) => {
      queryClient.setQueryData(roleKeys.detail(updatedRole.id), updatedRole);
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });
    },
  });
}
export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: number;
      permissionIds: number[];
    }) => updateRolePermissions(roleId, permissionIds),
    onSuccess: (updatedRole) => {
      queryClient.setQueryData(roleKeys.detail(updatedRole.id), updatedRole);
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: ["permissions"],
      });
    },
  });
}
export function useActivateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateRole,
    onSuccess: (updatedRole) => {
      queryClient.setQueryData(roleKeys.detail(updatedRole.id), updatedRole);
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });
    },
  });
}
export function useDeactivateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateRole,
    onSuccess: (updatedRole) => {
      queryClient.setQueryData(roleKeys.detail(updatedRole.id), updatedRole);
      queryClient.invalidateQueries({
        queryKey: roleKeys.lists(),
      });
    },
  });
}
