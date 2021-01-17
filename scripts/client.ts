import chokidar from "chokidar";
import { build, BuildOptions } from "esbuild";
import { callWebsocketClient } from "./websocketServer";
import { log } from "./log";

export async function client(
  watch: string,
  production: boolean,
  esbuildConfig: BuildOptions
) {
  const builder = await build(esbuildConfig);
  log(`client build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);

  if (!production) {
    chokidar.watch(watch, {}).on("change", (eventName, path) => {
      const msg = `client file changed ${eventName}`;
      log(msg);

      // rebuild only be if incremental config
      if (builder.rebuild) {
        return builder.rebuild().then(() => {
          callWebsocketClient(msg);
        });
      } else {
        return build(esbuildConfig);
      }
    });
  }
}
