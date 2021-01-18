import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";

type config = {
  watch: string;
  name?: string;
};

export async function single(config: config|null, esbuildConfig: BuildOptions) {
  const builder = await build(esbuildConfig);
  const _name = config && config.name || "single";

  log(
    `${_name} build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`
  );

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", async (eventName) => {
      const msg = `${_name} file changed ${eventName}`;
      log(msg);

      if (builder.rebuild) {
        return builder.rebuild().then(() => {
          callWebsocketClient(msg);
        });
      }
    });
  }
}
