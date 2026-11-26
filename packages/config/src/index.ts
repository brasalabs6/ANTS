import manifest from "../../../package.json";

declare const ANTS_BUILD_REVISION: string | undefined;

export const version = manifest.version;
export const buildRevision =
  typeof ANTS_BUILD_REVISION === "string" ? ANTS_BUILD_REVISION : "source";
