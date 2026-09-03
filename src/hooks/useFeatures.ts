import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  disableFeature,
  enableFeature,
  getFeatures,
} from "../services/featureService";
export const featureKeys = {
  all: ["features"] as const,
  list: () => [...featureKeys.all, "list"] as const,
};
export function useFeatures() {
  return useQuery({
    queryKey: featureKeys.list(),
    queryFn: getFeatures,
  });
}
export function useEnableFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enableFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: featureKeys.list(),
      });
    },
  });
}
export function useDisableFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: disableFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: featureKeys.list(),
      });
    },
  });
}
