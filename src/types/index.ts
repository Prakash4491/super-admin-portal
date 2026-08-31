export type TenantStatus = "ACTIVE" | "INACTIVE";
export type Plan = "BASIC" | "PRO" | "ENTERPRISE";
export type OrganizationStatus = "ACTIVE" | "INACTIVE";
export type UserStatus = "ACTIVE" | "INACTIVE";

export type UserRole = "ADMIN" | "MANAGER" | "USER";

export interface User {
  id: number;

  tenantId: number;
  tenantName: string;

  organizationId: number;
  organizationName: string;

  name: string;
  email: string;
  phone: string;

  role: UserRole;
  status: UserStatus;

  createdAt: string;
  lastLogin: string;
}

export interface UserFormValues {
  tenantId: number;
  organizationId: number;

  name: string;
  email: string;
  phone: string;

  role: UserRole;
  status: UserStatus;
}

export interface UserListParams {
  search: string;

  tenantId: number | "";
  organizationId: number | "";

  status: UserStatus | "";
  role: UserRole | "";

  page: number;
  size: number;

  sortBy: keyof User;
  sortDir: "asc" | "desc";
}

export interface UserListResponse {
  content: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface Organization {
  id: number;
  tenantId: number;
  tenantName: string;
  name: string;
  code: string;
  description: string;
  status: OrganizationStatus;
  users: number;
  createdAt: string;
}

export interface OrganizationFormValues {
  tenantId: number;
  name: string;
  code: string;
  description: string;
  status: OrganizationStatus;
}

export interface OrganizationListParams {
  search: string;
  status: OrganizationStatus | "";
  tenantId: number | "";
  page: number;
  size: number;
  sortBy: keyof Organization;
  sortDir: "asc" | "desc";
}

export interface OrganizationListResponse {
  content: Organization[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

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
