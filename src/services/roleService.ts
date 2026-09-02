import { initialRoles } from "../data/roles";
import type {
  Role,
  RoleFormValues,
  RoleListParams,
  RoleListResponse,
  RoleStatus,
} from "../types";
let roles: Role[] = structuredClone(initialRoles);
let nextId = Math.max(...roles.map((role) => role.id)) + 1;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
export async function getRoles(
  params: RoleListParams,
): Promise<RoleListResponse> {
  await delay();
  const search = params.search.trim().toLowerCase();
  let result = roles.filter((role) => {
    const matchesSearch =
      !search ||
      role.name.toLowerCase().includes(search) ||
      role.description.toLowerCase().includes(search);
    const matchesTenant = !params.tenantId || role.tenantId === params.tenantId;
    const matchesStatus = !params.status || role.status === params.status;
    return matchesSearch && matchesTenant && matchesStatus;
  });
  result.sort((a, b) => {
    const aValue = a[params.sortBy];
    const bValue = b[params.sortBy];
    if (aValue === bValue) {
      return 0;
    }
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
    content: structuredClone(result.slice(start, start + params.size)),
    page: params.page,
    size: params.size,
    totalElements,
    totalPages,
  };
}
export async function getRole(id: number): Promise<Role> {
  await delay();
  const role = roles.find((item) => item.id === id);
  if (!role) {
    throw new Error("Role not found.");
  }
  return structuredClone(role);
}
export async function createRole(values: RoleFormValues): Promise<Role> {
  await delay();
  const name = values.name.trim().toUpperCase();
  if (
    roles.some(
      (role) =>
        role.name.toUpperCase() === name && role.tenantId === values.tenantId,
    )
  ) {
    throw new Error("Role already exists for this tenant.");
  }
  const tenantNames: Record<number, string> = {
    1: "Acme Corporation",
    2: "TechNova",
    3: "Alpha Ltd",
    4: "BluePeak Systems",
    5: "CloudBridge",
    6: "Delta Works",
    7: "Evergreen Labs",
    8: "Fusion Retail",
    9: "GreenField Finance",
    10: "Horizon Media",
    11: "Insight Technologies",
    12: "Jupiter Logistics",
  };
  const role: Role = {
    id: nextId++,
    name,
    description: values.description.trim(),
    tenantId: values.tenantId,
    tenantName: tenantNames[values.tenantId] ?? "Unknown Tenant",
    permissions: 0,
    permissionIds: [],
    users: 0,
    status: values.status,
    createdAt: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  roles = [...roles, role];
  return structuredClone(role);
}
export async function updateRole(
  id: number,
  values: RoleFormValues,
): Promise<Role> {
  await delay();
  const index = roles.findIndex((role) => role.id === id);
  if (index === -1) {
    throw new Error("Role not found.");
  }
  roles[index] = {
    ...roles[index],
    description: values.description.trim(),
    tenantId: values.tenantId,
    status: values.status,
  };
  const tenantNames: Record<number, string> = {
    1: "Acme Corporation",
    2: "TechNova",
    3: "Alpha Ltd",
    4: "BluePeak Systems",
    5: "CloudBridge",
    6: "Delta Works",
    7: "Evergreen Labs",
    8: "Fusion Retail",
    9: "GreenField Finance",
    10: "Horizon Media",
    11: "Insight Technologies",
    12: "Jupiter Logistics",
  };
  roles[index].tenantName = tenantNames[values.tenantId] ?? "Unknown Tenant";
  return structuredClone(roles[index]);
}
export async function activateRole(id: number): Promise<Role> {
  await delay();
  return changeStatus(id, "ACTIVE");
}
export async function deactivateRole(id: number): Promise<Role> {
  await delay();
  return changeStatus(id, "INACTIVE");
}
async function changeStatus(id: number, status: RoleStatus): Promise<Role> {
  const index = roles.findIndex((role) => role.id === id);
  if (index === -1) {
    throw new Error("Role not found.");
  }
  roles[index] = {
    ...roles[index],
    status,
  };
  return structuredClone(roles[index]);
}
export async function updateRolePermissions(
  roleId: number,
  permissionIds: number[],
): Promise<Role> {
  await delay();
  const index = roles.findIndex((role) => role.id === roleId);
  if (index === -1) {
    throw new Error("Role not found.");
  }
  const uniquePermissionIds = [...new Set(permissionIds)];
  const updatedRole: Role = {
    ...roles[index],
    permissionIds: uniquePermissionIds,
    permissions: uniquePermissionIds.length,
  };
  roles[index] = updatedRole;
  return structuredClone(updatedRole);
}
export function getCurrentRoles(): Role[] {
  return structuredClone(roles);
}
