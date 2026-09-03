export type TenantStatus = "ACTIVE" | "INACTIVE";
export type Plan = "BASIC" | "PRO" | "ENTERPRISE";
export type OrganizationStatus = "ACTIVE" | "INACTIVE";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type UserRole = "ADMIN" | "MANAGER" | "USER";
export type RoleStatus = "ACTIVE" | "INACTIVE";
export type PermissionStatus = "ACTIVE" | "INACTIVE";
export type DataPermissionStatus = "ACTIVE" | "INACTIVE";
export type FeatureStatus = "ENABLED" | "DISABLED";
export type LicenseStatus = "ACTIVE" | "EXPIRING" | "EXPIRED" | "SUSPENDED";

export type License = {
  id: number;
  licenseKey: string;
  organization: string;
  licenseType: string;
  expiryDate: string;
  status: LicenseStatus;
};
export type Feature = {
  id: number;
  name: string;
  module: string;
  licensePlan: string;
  status: FeatureStatus;
  description: string;
};
export type SMTPConfiguration = {
  host: string;
  port: number;
  username: string;
  password: string;
  configured: boolean;
};
export type SMSGatewayConfiguration = {
  provider: string;
  endpoint: string;
  apiKey: string;
  configured: boolean;
};
export type APIGatewayConfiguration = {
  baseUrl: string;
  timeout: number;
  configured: boolean;
};
export type PlatformConfiguration = {
  id: number;
  platformName: string;
  platformUrl: string;
  defaultTimeZone: string;
  defaultLanguage: string;
  smtp: SMTPConfiguration;
  smsGateway: SMSGatewayConfiguration;
  apiGateway: APIGatewayConfiguration;
  version: number;
  lastModified: string;
  modifiedBy: string;
};
export type DataPermissionScope =
  | "ORGANIZATION"
  | "BUSINESS_UNIT"
  | "DEPARTMENT"
  | "BRANCH"
  | "PROJECT"
  | "LOCATION"
  | "CUSTOMER"
  | "VENDOR";
export type RecordOwnership =
  | "OWN_RECORDS"
  | "TEAM_RECORDS"
  | "DEPARTMENT_RECORDS"
  | "ORGANIZATION_RECORDS";
export type DataPermission = {
  id: number;
  policyName: string;
  policyType: string;
  organization: string;
  organizationId: number;
  roleId: number;
  roleName: string;
  status: DataPermissionStatus;
  scopes: DataPermissionScope[];
  department?: string;
  businessUnit?: string;
  branch?: string;
  project?: string;
  location?: string;
  customer?: string;
  vendor?: string;
  ownershipRules: RecordOwnership[];
  viewSubordinateRecords: boolean;
  approveSubordinateTransactions: boolean;
  accessibleRecords: number;
  restrictedRecords: number;
  createdBy: string;
  createdAt: string;
  lastModified: string;
};
export type Permission = {
  id: number;
  name: string;
  description: string;
  module: string;
  roles: number;
  roleNames: string[];
  status: PermissionStatus;
  createdAt: string;
};
export type PermissionFormValues = {
  name: string;
  description: string;
  module: string;
  status: PermissionStatus;
};
export type PermissionListParams = {
  search: string;
  module: string;
  status: PermissionStatus | "";
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};
export type Role = {
  id: number;
  name: string;
  description: string;
  tenantId: number;
  tenantName: string;
  permissions: number;
  permissionIds: number[];
  users: number;
  status: RoleStatus;
  createdAt: string;
};
export type RoleFormValues = {
  name: string;
  description: string;
  tenantId: number;
  status: RoleStatus;
};
export type RoleListParams = {
  search: string;
  tenantId: number | "";
  status: RoleStatus | "";
  page: number;
  size: number;
  sortBy: "name" | "createdAt" | "users";
  sortDir: "asc" | "desc";
};
export type RoleListResponse = {
  content: Role[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};
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
