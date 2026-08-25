export type TenantStatus = "ACTIVE" | "INACTIVE";
export type Plan = "BASIC" | "PRO" | "ENTERPRISE";

export interface Tenant {
  id: number;
  name: string;
  code: string;
  adminName: string;
  adminEmail: string;
  phone: string;
  plan: Plan;
  country: string;
  timeZone: string;
  status: TenantStatus;
  createdAt: string;
  users: number;
  organizations: number;
  activeUsers: number;
  storage: number;
}

export interface TenantFormValues {
  name: string;
  code: string;
  adminName: string;
  adminEmail: string;
  phone: string;
  plan: Plan;
  country: string;
  timeZone: string;
  status: TenantStatus;
}

export interface TenantListParams {
  search: string;
  status: TenantStatus | "";
  plan: Plan | "";
  page: number;
  size: number;
  sortBy: keyof Tenant;
  sortDir: "asc" | "desc";
}

export interface TenantListResponse {
  content: Tenant[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface TenantStats {
  users: number;
  organizations: number;
  activeUsers: number;
  storage: number;
}

export interface DashboardKpis {
  totalTenants: number;
  activeTenants: number;
  inactiveTenants: number;
  totalUsers: number;
  activeLicenses: number;
}

export interface PlatformHealth {
  apiGateway: string;
  database: string;
  server: string;
  storage: number;
  cpu: number;
  memory: number;
}

export interface Activity {
  id: number;
  message: string;
  tenantName: string;
  time: string;
}

export interface Analytics {
  tenantGrowth: Array<{ month: string; tenants: number }>;
  statusBreakdown: Array<{ status: string; count: number }>;
}
