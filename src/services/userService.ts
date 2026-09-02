import { initialUsers } from "../data/users";
import { initialTenants } from "../data/tenants";
import { initialOrganizations } from "../data/organizations";
import type {
  User,
  UserFormValues,
  UserListParams,
  UserListResponse,
  UserStatus,
} from "../types";
let users: User[] = structuredClone(initialUsers);
let nextId = Math.max(...users.map((user) => user.id)) + 1;
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));
export async function getUsers(
  params: UserListParams,
): Promise<UserListResponse> {
  await delay();
  const search = params.search.trim().toLowerCase();
  let result = users.filter((user) => {
    const matchesSearch =
      !search ||
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.tenantName.toLowerCase().includes(search) ||
      user.organizationName.toLowerCase().includes(search);
    const matchesTenant = !params.tenantId || user.tenantId === params.tenantId;
    const matchesOrganization =
      !params.organizationId || user.organizationId === params.organizationId;
    const matchesStatus = !params.status || user.status === params.status;
    const matchesRole = !params.role || user.role === params.role;
    return (
      matchesSearch &&
      matchesTenant &&
      matchesOrganization &&
      matchesStatus &&
      matchesRole
    );
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
export async function getUser(id: number): Promise<User> {
  await delay();
  const user = users.find((item) => item.id === id);
  if (!user) {
    throw new Error("User not found.");
  }
  return structuredClone(user);
}
export async function createUser(values: UserFormValues): Promise<User> {
  await delay();
  const email = values.email.trim().toLowerCase();
  if (users.some((user) => user.email.toLowerCase() === email)) {
    throw new Error("A user with this email already exists.");
  }
  const tenantName = getTenantName(values.tenantId);
  const organizationName = getOrganizationName(values.organizationId);
  const user: User = {
    id: nextId++,
    tenantId: values.tenantId,
    tenantName,
    organizationId: values.organizationId,
    organizationName,
    name: values.name.trim(),
    email,
    phone: values.phone.trim(),
    role: values.role,
    status: values.status,
    createdAt: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    lastLogin: "Never",
  };
  users = [...users, user];
  return structuredClone(user);
}
function getTenantName(tenantId: number): string {
  const tenant = initialTenants.find((item) => item.id === tenantId);
  return tenant?.name ?? "Unknown Tenant";
}
function getOrganizationName(organizationId: number): string {
  const organization = initialOrganizations.find(
    (item) => item.id === organizationId,
  );
  return organization?.name ?? "Unknown Organization";
}
export async function updateUser(
  id: number,
  values: UserFormValues,
): Promise<User> {
  await delay();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    throw new Error("User not found.");
  }
  users[index] = {
    ...users[index],
    tenantId: values.tenantId,
    tenantName: getTenantName(values.tenantId),
    organizationId: values.organizationId,
    organizationName: getOrganizationName(values.organizationId),
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim(),
    role: values.role,
    status: values.status,
  };
  return structuredClone(users[index]);
}
export async function activateUser(id: number): Promise<User> {
  await delay();
  return changeStatus(id, "ACTIVE");
}
export async function deactivateUser(id: number): Promise<User> {
  await delay();
  return changeStatus(id, "INACTIVE");
}
async function changeStatus(id: number, status: UserStatus): Promise<User> {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    throw new Error("User not found.");
  }
  users[index] = {
    ...users[index],
    status,
  };
  return structuredClone(users[index]);
}
