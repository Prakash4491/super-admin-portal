import { initialDataPermissions } from "../data/dataPermissions";
import type { DataPermission } from "../types";
import type { DataPermissionFormValues } from "../hooks/useDataPermissions";
let dataPermissions: DataPermission[] = structuredClone(initialDataPermissions);
const delay = (milliseconds = 300) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));
export async function getDataPermissions(): Promise<DataPermission[]> {
  await delay();
  return structuredClone(dataPermissions);
}
export async function getDataPermission(id: number): Promise<DataPermission> {
  await delay();
  const policy = dataPermissions.find((item) => item.id === id);
  if (!policy) {
    throw new Error("Data permission policy not found.");
  }
  return structuredClone(policy);
}
export async function createDataPermission(
  values: DataPermissionFormValues,
): Promise<DataPermission> {
  await delay();
  const nextId = Math.max(...dataPermissions.map((item) => item.id), 0) + 1;
  const now = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const newPolicy: DataPermission = {
    id: nextId,
    policyName: values.policyName.trim(),
    policyType: values.policyType,
    organization: values.organization,
    organizationId: values.organizationId,
    roleId: values.roleId,
    roleName: values.roleName,
    status: values.status,
    scopes: values.scopes,
    department: values.department,
    businessUnit: values.businessUnit,
    branch: values.branch,
    project: values.project,
    location: values.location,
    customer: values.customer,
    vendor: values.vendor,
    ownershipRules: values.ownershipRules,
    viewSubordinateRecords: values.viewSubordinateRecords,
    approveSubordinateTransactions: values.approveSubordinateTransactions,
    accessibleRecords: 0,
    restrictedRecords: 0,
    createdBy: "Super Admin",
    createdAt: now,
    lastModified: now,
  };
  dataPermissions = [newPolicy, ...dataPermissions];
  return structuredClone(newPolicy);
}
export async function updateDataPermission(
  policy: DataPermission,
): Promise<DataPermission> {
  await delay();
  const index = dataPermissions.findIndex((item) => item.id === policy.id);
  if (index === -1) {
    throw new Error("Data permission policy not found.");
  }
  const updatedPolicy: DataPermission = {
    ...dataPermissions[index],
    ...policy,
    lastModified: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  dataPermissions[index] = structuredClone(updatedPolicy);
  return structuredClone(dataPermissions[index]);
}
export async function activateDataPermission(
  id: number,
): Promise<DataPermission> {
  await delay();
  const index = dataPermissions.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Data permission policy not found.");
  }
  dataPermissions[index] = {
    ...dataPermissions[index],
    status: "ACTIVE",
    lastModified: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  return structuredClone(dataPermissions[index]);
}
export async function deactivateDataPermission(
  id: number,
): Promise<DataPermission> {
  await delay();
  const index = dataPermissions.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error("Data permission policy not found.");
  }
  dataPermissions[index] = {
    ...dataPermissions[index],
    status: "INACTIVE",
    lastModified: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };
  return structuredClone(dataPermissions[index]);
}
