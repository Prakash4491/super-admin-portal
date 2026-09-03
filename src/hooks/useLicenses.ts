import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateLicense,
  renewLicense,
  suspendLicense,
  getLicenses,
} from "../services/licenseService";
export const licenseKeys = {
  all: ["licenses"] as const,
  lists: () => [...licenseKeys.all, "list"] as const,
};
export function useLicenses() {
  return useQuery({
    queryKey: licenseKeys.lists(),
    queryFn: getLicenses,
  });
}
export function useRenewLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: renewLicense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: licenseKeys.lists(),
      });
    },
  });
}
export function useSuspendLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: suspendLicense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: licenseKeys.lists(),
      });
    },
  });
}
export function useActivateLicense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateLicense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: licenseKeys.lists(),
      });
    },
  });
}
