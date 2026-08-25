import { useQuery } from "@tanstack/react-query";
import {
  getActivities,
  getAnalytics,
  getDashboardKpis,
  getHealth
} from "../services/tenantService";

export function useDashboardKpis() {
  return useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: getDashboardKpis
  });
}

export function useDashboardHealth() {
  return useQuery({
    queryKey: ["dashboard", "health"],
    queryFn: getHealth
  });
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "analytics"],
    queryFn: getAnalytics
  });
}

export function useDashboardActivities() {
  return useQuery({
    queryKey: ["dashboard", "activities"],
    queryFn: getActivities
  });
}
