import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";

export async function single(
  watch: string,
  esbuildConfig: BuildOptions,
  name = "single"
) {
  const builder = await build(esbuildConfig);

  chokidar.watch(watch, {}).on("change", async (eventName, path) => {
    const msg = `${single} file changed ${eventName}`;
    log(msg);

    if (builder.rebuild) {
      return builder.rebuild().then(() => {
        callWebsocketClient(msg);
      });
    }
  });
}
