import { initialGlobalSettings } from "../data/globalSettings";
import type { GlobalSettings } from "../types";
let settings: GlobalSettings = structuredClone(initialGlobalSettings);
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
export async function getGlobalSettings() {
  await delay();
  return structuredClone(settings);
}
export async function updateGlobalSettings(updatedSettings: GlobalSettings) {
  await delay();
  settings = {
    ...updatedSettings,
    lastUpdatedBy: "Super Administrator",
    lastUpdatedOn: new Date().toLocaleString(),
  };
  return structuredClone(settings);
}
export async function resetGlobalSettings() {
  await delay();
  settings = structuredClone(initialGlobalSettings);
  return structuredClone(settings);
}
