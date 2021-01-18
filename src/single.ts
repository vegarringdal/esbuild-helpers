import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";
import { publish, subscribe } from "./events";

type config = {
  watch: string;
  name?: string;
  transmitt?: string;
  listen?: string;
};

function logMsgBuild(name: string, esbuildConfig: BuildOptions) {
  log(name.toUpperCase(),`build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);
}

export async function single(
  config: config | null,
  esbuildConfig: BuildOptions
) {
  const builder = await build(esbuildConfig);
  const _name = (config && config.name) || "single";

  logMsgBuild(_name, esbuildConfig);

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", async (eventName) => {
      const msg = `file changed ${eventName}`;
      log(`${_name}`, msg);

      if (builder.rebuild) {
        return builder.rebuild().then(() => {
          logMsgBuild(_name, esbuildConfig);
          callWebsocketClient(msg);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      } else {
        // no increment, then we just build it
        return build(esbuildConfig).then(() => {
          logMsgBuild(_name, esbuildConfig);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      }
    });
  }

  if (config?.listen) {
    subscribe(config.listen, async function () {
      const msg = `subscribe event ${config.listen}`;
      log(_name, msg);
      if (builder && builder.rebuild) {
        builder.rebuild().then(() => {
          logMsgBuild(_name, esbuildConfig);
          callWebsocketClient(msg);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      } else {
        build(esbuildConfig).then(() => {
          logMsgBuild(_name, esbuildConfig);
          callWebsocketClient(msg);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      }
    });
  }
}
