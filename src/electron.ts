
import { BuildOptions } from "esbuild";
import { electronConfig } from "./interfaces";
import { builder } from "./builder";

export async function electron(
  config: electronConfig | null,
  esbuildConfig: BuildOptions
) {
  builder("ELECTRON", config, esbuildConfig);
}
