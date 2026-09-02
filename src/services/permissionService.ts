import { initialPermissions } from "../data/permissions";
import { getCurrentRoles } from "./roleService";
import type {
  Permission,
  PermissionFormValues,
  PermissionListParams,
} from "../types";
type PermissionPage = {
  content: Permission[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};
let permissions: Permission[] = [...initialPermissions];
function addRoleInformation(permission: Permission): Permission {
  const currentRoles = getCurrentRoles();
  const assignedRoles = currentRoles.filter((role) =>
    role.permissionIds?.includes(permission.id),
  );
  return {
    ...permission,
    roles: assignedRoles.length,
    roleNames: assignedRoles.map((role) => role.name),
  };
}
export async function getPermissions(
  params: PermissionListParams,
): Promise<PermissionPage> {
  await delay();
  let result = permissions.map((permission) => addRoleInformation(permission));
  if (params.search.trim()) {
    const search = params.search.trim().toLowerCase();
    result = result.filter(
      (permission) =>
        permission.name.toLowerCase().includes(search) ||
        permission.description.toLowerCase().includes(search) ||
        permission.module.toLowerCase().includes(search),
    );
  }
  if (params.module) {
    result = result.filter((permission) => permission.module === params.module);
  }
  if (params.status) {
    result = result.filter((permission) => permission.status === params.status);
  }
  result.sort((a, b) => {
    const field =
      params.sortBy === "module"
        ? a.module.localeCompare(b.module)
        : a.name.localeCompare(b.name);
    return params.sortDir === "desc" ? -field : field;
  });
  const totalElements = result.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / params.size));
  const start = params.page * params.size;
  const end = start + params.size;
  return {
    content: structuredClone(result.slice(start, end)),
    totalElements,
    totalPages,
    page: params.page,
    size: params.size,
  };
}
export async function getPermission(
  id: number,
): Promise<Permission | undefined> {
  await delay();
  const permission = permissions.find((permission) => permission.id === id);
  if (!permission) {
    return undefined;
  }
  return structuredClone(addRoleInformation(permission));
}
export async function createPermission(
  values: PermissionFormValues,
): Promise<Permission> {
  await delay();
  const nextId =
    Math.max(...permissions.map((permission) => permission.id), 0) + 1;
  const permission: Permission = {
    id: nextId,
    name: values.name.trim(),
    description: values.description.trim(),
    module: values.module,
    roles: 0,
    roleNames: [],
    status: values.status,
    createdAt: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  permissions = [permission, ...permissions];
  return structuredClone(permission);
}
export async function updatePermission(
  id: number,
  values: PermissionFormValues,
): Promise<Permission> {
  await delay();
  const index = permissions.findIndex((permission) => permission.id === id);
  if (index === -1) {
    throw new Error("Permission not found.");
  }
  const current = permissions[index];
  const updated: Permission = {
    ...current,
    name: values.name.trim(),
    description: values.description.trim(),
    module: values.module,
    status: values.status,
  };
  permissions[index] = updated;
  return structuredClone(addRoleInformation(updated));
}
export async function activatePermission(id: number): Promise<Permission> {
  await delay();
  const permission = permissions.find((permission) => permission.id === id);
  if (!permission) {
    throw new Error("Permission not found.");
  }
  permission.status = "ACTIVE";
  return structuredClone(addRoleInformation(permission));
}
export async function deactivatePermission(id: number): Promise<Permission> {
  await delay();
  const permission = permissions.find((permission) => permission.id === id);
  if (!permission) {
    throw new Error("Permission not found.");
  }
  permission.status = "INACTIVE";
  return structuredClone(addRoleInformation(permission));
}
function delay(milliseconds = 300) {
  return new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
}
