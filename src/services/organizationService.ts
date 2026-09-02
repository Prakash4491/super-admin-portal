import { initialOrganizations } from "../data/organizations";
import { initialTenants } from "../data/tenants";
import type {
  Organization,
  OrganizationFormValues,
  OrganizationListParams,
  OrganizationListResponse,
  OrganizationStatus,
} from "../types";
let organizations: Organization[] = structuredClone(initialOrganizations);
let nextId =
  Math.max(...organizations.map((organization) => organization.id)) + 1;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
export async function getOrganizations(
  params: OrganizationListParams,
): Promise<OrganizationListResponse> {
  await delay();
  const search = params.search.trim().toLowerCase();
  let result = organizations.filter((organization) => {
    const matchesSearch =
      !search ||
      organization.name.toLowerCase().includes(search) ||
      organization.code.toLowerCase().includes(search) ||
      organization.tenantName.toLowerCase().includes(search);
    const matchesStatus =
      !params.status || organization.status === params.status;
    const matchesTenant =
      !params.tenantId || organization.tenantId === params.tenantId;
    return matchesSearch && matchesStatus && matchesTenant;
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
export async function getOrganization(id: number): Promise<Organization> {
  await delay();
  const organization = organizations.find((item) => item.id === id);
  if (!organization) {
    throw new Error("Organization not found.");
  }
  return structuredClone(organization);
}
export async function createOrganization(
  values: OrganizationFormValues,
): Promise<Organization> {
  await delay();
  const code = values.code.trim().toUpperCase();
  if (
    organizations.some(
      (organization) => organization.code.toUpperCase() === code,
    )
  ) {
    throw new Error("Organization code already exists.");
  }
  const organization: Organization = {
    id: nextId++,
    tenantId: values.tenantId,
    tenantName: getTenantName(values.tenantId),
    name: values.name.trim(),
    code,
    description: values.description.trim(),
    status: values.status,
    users: 0,
    createdAt: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  organizations = [...organizations, organization];
  return structuredClone(organization);
}
export async function updateOrganization(
  id: number,
  values: OrganizationFormValues,
): Promise<Organization> {
  await delay();
  const index = organizations.findIndex(
    (organization) => organization.id === id,
  );
  if (index === -1) {
    throw new Error("Organization not found.");
  }
  organizations[index] = {
    ...organizations[index],
    tenantId: values.tenantId,
    tenantName: getTenantName(values.tenantId),
    name: values.name.trim(),
    description: values.description.trim(),
    status: values.status,
  };
  return structuredClone(organizations[index]);
}
export async function activateOrganization(id: number): Promise<Organization> {
  await delay();
  return changeStatus(id, "ACTIVE");
}
export async function deactivateOrganization(
  id: number,
): Promise<Organization> {
  await delay();
  return changeStatus(id, "INACTIVE");
}
async function changeStatus(
  id: number,
  status: OrganizationStatus,
): Promise<Organization> {
  const index = organizations.findIndex(
    (organization) => organization.id === id,
  );
  if (index === -1) {
    throw new Error("Organization not found.");
  }
  organizations[index] = {
    ...organizations[index],
    status,
  };
  return structuredClone(organizations[index]);
}
function getTenantName(tenantId: number): string {
  const tenant = initialTenants.find((item) => item.id === tenantId);
  return tenant?.name ?? "Unknown Tenant";
}
