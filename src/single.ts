import { BuildOptions } from "esbuild";
import { builder } from "./builder";
import { singleConfig } from "./interfaces";

export async function single(
  config: singleConfig | null,
  esbuildConfig: BuildOptions
) {
  builder("SINGLE", config, esbuildConfig);
}
