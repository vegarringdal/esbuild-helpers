import { BuildOptions } from "esbuild";
import { builder } from "./builder";
import { nodejsConfig } from "./interfaces";

export async function nodejs(
  config: nodejsConfig | null,
  esbuildConfig: BuildOptions,
) {
  builder("NODEJS", config, esbuildConfig);
}
