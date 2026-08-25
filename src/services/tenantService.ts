import { initialTenants } from "../data/tenants";
import type {
  Plan,
  Tenant,
  TenantFormValues,
  TenantListParams,
  TenantListResponse,
  TenantStats,
  TenantStatus,
} from "../types";

let tenants: Tenant[] = structuredClone(initialTenants);
let nextId = Math.max(...tenants.map((tenant) => tenant.id)) + 1;

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

interface Activity {
  id: number;
  message: string;
  tenantName: string;
  time: string;
}

let activities: Activity[] = [];
let nextActivityId = 1;

export async function getTenants(
  params: TenantListParams,
): Promise<TenantListResponse> {
  await delay();

  const search = params.search.trim().toLowerCase();

  let result = tenants.filter((tenant) => {
    const matchesSearch =
      !search ||
      tenant.name.toLowerCase().includes(search) ||
      tenant.code.toLowerCase().includes(search);

    const matchesStatus = !params.status || tenant.status === params.status;
    const matchesPlan = !params.plan || tenant.plan === params.plan;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  result.sort((a, b) => {
    const aValue = a[params.sortBy];
    const bValue = b[params.sortBy];

    if (aValue === bValue) return 0;

    const comparison = String(aValue).localeCompare(String(bValue), undefined, {
      numeric: true,
      sensitivity: "base",
    });

    return params.sortDir === "asc" ? comparison : -comparison;
  });

  const totalElements = result.length;
  const totalPages = Math.max(Math.ceil(totalElements / params.size), 1);
  const start = params.page * params.size;

  return {
    content: result.slice(start, start + params.size),
    page: params.page,
    size: params.size,
    totalElements,
    totalPages,
  };
}

export async function getTenant(id: number): Promise<Tenant> {
  await delay();
  const tenant = tenants.find((item) => item.id === id);

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  return structuredClone(tenant);
}

export async function getTenantStats(id: number): Promise<TenantStats> {
  const tenant = await getTenant(id);

  return {
    users: tenant.users,
    organizations: tenant.organizations,
    activeUsers: tenant.activeUsers,
    storage: tenant.storage,
  };
}

export async function createTenant(values: TenantFormValues): Promise<Tenant> {
  await delay();

  const code = values.code.trim().toUpperCase();

  if (tenants.some((tenant) => tenant.code.toUpperCase() === code)) {
    throw new Error("Tenant code already exists.");
  }

  const tenant: Tenant = {
    id: nextId++,
    name: values.name.trim(),
    code,
    adminName: values.adminName.trim(),
    adminEmail: values.adminEmail.trim(),
    phone: values.phone.trim(),
    plan: values.plan,
    country: values.country,
    timeZone: values.timeZone,
    status: values.status,
    createdAt: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    users: 0,
    organizations: 1,
    activeUsers: 0,
    storage: 0,
  };

  tenants = [...tenants, tenant];
  addActivity("New tenant created", tenant.name);
  return structuredClone(tenant);
}

export async function updateTenant(
  id: number,
  values: Omit<TenantFormValues, "code">,
): Promise<Tenant> {
  await delay();

  const index = tenants.findIndex((tenant) => tenant.id === id);

  if (index === -1) {
    throw new Error("Tenant not found.");
  }

  tenants[index] = {
    ...tenants[index],
    name: values.name.trim(),
    adminName: values.adminName.trim(),
    adminEmail: values.adminEmail.trim(),
    phone: values.phone.trim(),
    plan: values.plan,
    country: values.country,
    timeZone: values.timeZone,
    status: values.status,
  };
  addActivity("Tenant configuration updated", tenants[index].name);
  return structuredClone(tenants[index]);
}

export async function activateTenant(id: number): Promise<Tenant> {
  await delay();
  return changeStatus(id, "ACTIVE");
}

export async function deactivateTenant(id: number): Promise<Tenant> {
  await delay();
  return changeStatus(id, "INACTIVE");
}

async function changeStatus(id: number, status: TenantStatus): Promise<Tenant> {
  const index = tenants.findIndex((tenant) => tenant.id === id);

  if (index === -1) {
    throw new Error("Tenant not found.");
  }

  tenants[index] = { ...tenants[index], status };
  addActivity(
    status === "ACTIVE" ? "Tenant activated" : "Tenant deactivated",
    tenants[index].name,
  );
  return structuredClone(tenants[index]);
}

export async function getDashboardKpis() {
  await delay(180);

  const activeTenants = tenants.filter(
    (tenant) => tenant.status === "ACTIVE",
  ).length;
  const inactiveTenants = tenants.filter(
    (tenant) => tenant.status === "INACTIVE",
  ).length;

  return {
    totalTenants: tenants.length,
    activeTenants,
    inactiveTenants,
    totalUsers: tenants.reduce((sum, tenant) => sum + tenant.users, 0),
    activeLicenses: activeTenants,
  };
}

export async function getHealth() {
  await delay(160);

  return {
    apiGateway: "Healthy",
    database: "Connected",
    server: "Running",
    storage: 68,
    cpu: 42,
    memory: 61,
  };
}

export async function getAnalytics() {
  await delay(160);

  const active = tenants.filter((tenant) => tenant.status === "ACTIVE").length;
  const inactive = tenants.filter(
    (tenant) => tenant.status === "INACTIVE",
  ).length;

  return {
    tenantGrowth: [
      { month: "Mar", tenants: 0 },
      { month: "Apr", tenants: 0 },
      { month: "May", tenants: 0 },
      { month: "Jun", tenants: 0 },
      { month: "Jul", tenants: 0 },
      { month: "Aug", tenants: tenants.length },
    ],
    statusBreakdown: [
      { status: "ACTIVE", count: active },
      { status: "INACTIVE", count: inactive },
    ],
  };
}
function addActivity(message: string, tenantName: string) {
  activities = [
    {
      id: nextActivityId++,
      message,
      tenantName,
      time: "Just now",
    },
    ...activities,
  ].slice(0, 10);
}

export async function getActivities() {
  await delay(100);

  return [...activities];
}
