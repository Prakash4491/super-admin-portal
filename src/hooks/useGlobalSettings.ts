import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getGlobalSettings,
  resetGlobalSettings,
  updateGlobalSettings,
} from "../services/globalSettingsService";
export const globalSettingsKeys = {
  all: ["globalSettings"] as const,
};
export function useGlobalSettings() {
  return useQuery({
    queryKey: globalSettingsKeys.all,
    queryFn: getGlobalSettings,
  });
}
export function useUpdateGlobalSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGlobalSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: globalSettingsKeys.all,
      });
    },
  });
}
export function useResetGlobalSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetGlobalSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: globalSettingsKeys.all,
      });
    },
  });
}
