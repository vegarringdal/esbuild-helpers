import { BuildOptions } from "esbuild";
import { clientConfig } from "./interfaces";
import { builder } from "./builder";

export async function client(
  config: clientConfig | null,
  esbuildConfig: BuildOptions
) {
  builder("CLIENT", config, esbuildConfig);
}
