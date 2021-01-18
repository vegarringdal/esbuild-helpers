import chokidar from "chokidar";
import { build, BuildOptions } from "esbuild";
import { callWebsocketClient } from "./websocketServer";
import { log } from "./log";

type config = {
  watch: string;
};


export async function client(config: config | null, esbuildConfig: BuildOptions) {
  const builder = await build(esbuildConfig);
  log(`client build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", (eventName, path) => {
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
