import { initialFeatures } from "../data/features";
import type { Feature } from "../types";
let features: Feature[] = structuredClone(initialFeatures);
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
export async function getFeatures(): Promise<Feature[]> {
  await delay();
  return structuredClone(features);
}
export async function enableFeature(id: number): Promise<Feature> {
  await delay();
  const feature = features.find((item) => item.id === id);
  if (!feature) {
    throw new Error("Feature not found");
  }
  feature.status = "ENABLED";
  return structuredClone(feature);
}
export async function disableFeature(id: number): Promise<Feature> {
  await delay();
  const feature = features.find((item) => item.id === id);
  if (!feature) {
    throw new Error("Feature not found");
  }
  feature.status = "DISABLED";
  return structuredClone(feature);
}
