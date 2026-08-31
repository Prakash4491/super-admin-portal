import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  activateOrganization,
  createOrganization,
  deactivateOrganization,
  getOrganization,
  getOrganizations,
  updateOrganization,
} from "../services/organizationService";

import type { OrganizationFormValues, OrganizationListParams } from "../types";

export const organizationKeys = {
  all: ["organizations"] as const,

  lists: () => [...organizationKeys.all, "list"] as const,

  list: (params: OrganizationListParams) =>
    [...organizationKeys.lists(), params] as const,

  details: () => [...organizationKeys.all, "detail"] as const,

  detail: (id: number) => [...organizationKeys.details(), id] as const,
};

export function useOrganizations(params: OrganizationListParams) {
  return useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => getOrganizations(params),
    placeholderData: (previous) => previous,
  });
}

export function useOrganization(id: number) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: () => getOrganization(id),
    enabled: Boolean(id),
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: OrganizationFormValues) => createOrganization(values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: organizationKeys.all,
      });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: OrganizationFormValues;
    }) => updateOrganization(id, values),

    onSuccess: (updatedOrganization) => {
      queryClient.setQueryData(
        organizationKeys.detail(updatedOrganization.id),
        updatedOrganization,
      );

      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });
    },
  });
}

export function useActivateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activateOrganization,

    onSuccess: (updatedOrganization) => {
      queryClient.setQueryData(
        organizationKeys.detail(updatedOrganization.id),
        updatedOrganization,
      );

      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });
    },
  });
}

export function useDeactivateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateOrganization,

    onSuccess: (updatedOrganization) => {
      queryClient.setQueryData(
        organizationKeys.detail(updatedOrganization.id),
        updatedOrganization,
      );

      queryClient.invalidateQueries({
        queryKey: organizationKeys.lists(),
      });
    },
  });
}
