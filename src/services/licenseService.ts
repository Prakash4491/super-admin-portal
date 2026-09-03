import { initialLicenses } from "../data/licenses";
import type { License } from "../types";
let licenses: License[] = structuredClone(initialLicenses);
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
export async function getLicenses(): Promise<License[]> {
  await delay();
  return structuredClone(licenses);
}
export async function renewLicense(id: number): Promise<License> {
  await delay();
  const license = licenses.find((item) => item.id === id);
  if (!license) {
    throw new Error("License not found");
  }
  license.status = "ACTIVE";
  return structuredClone(license);
}
export async function suspendLicense(id: number): Promise<License> {
  await delay();
  const license = licenses.find((item) => item.id === id);
  if (!license) {
    throw new Error("License not found");
  }
  license.status = "SUSPENDED";
  return structuredClone(license);
}
export async function activateLicense(id: number): Promise<License> {
  await delay();
  const license = licenses.find((item) => item.id === id);
  if (!license) {
    throw new Error("License not found");
  }
  license.status = "ACTIVE";
  return structuredClone(license);
}
