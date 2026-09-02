import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateUser,
  createUser,
  deactivateUser,
  getUser,
  getUsers,
  updateUser,
} from "../services/userService";
import type { UserFormValues, UserListParams } from "../types";
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UserListParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};
export function useUsers(params: UserListParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => getUsers(params),
    placeholderData: (previous) => previous,
  });
}
export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  });
}
export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: UserFormValues) => createUser(values),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.all,
      });
    },
  });
}
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: UserFormValues }) =>
      updateUser(id, values),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });
}
export function useActivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });
}
export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateUser,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });
}
