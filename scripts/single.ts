import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";

export async function single(
  watch: string,
  production: boolean,
  esbuildConfig: BuildOptions,
  name = "single"
) {
  const builder = await build(esbuildConfig);
  log(`${name} build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);

  if (!production) {
    chokidar.watch(watch, {}).on("change", async (eventName) => {
      const msg = `${name} file changed ${eventName}`;
      log(msg);

      if (builder.rebuild) {
        return builder.rebuild().then(() => {
          callWebsocketClient(msg);
        });
      }
    });
  }
}
