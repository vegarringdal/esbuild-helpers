import chokidar from "chokidar";
import { build, BuildOptions } from "esbuild";
import { callWebsocketClient } from "./websocketServer";
import { log } from "./log";
import { publish, subscribe } from "./events";

type config = {
  watch: string;
  transmitt?: string;
  listen?: string;
};

function send(msg: string) {
  log(`CLIENT`, msg);
}

function buildDone(esbuildConfig: BuildOptions) {
  send(`build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);
}


export async function client(
  config: config | null,
  esbuildConfig: BuildOptions
) {
  const builder = await build(esbuildConfig);
  buildDone(esbuildConfig);

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", (eventName, path) => {
      const msg = `file changed ${eventName}`;
      send(msg);

      // rebuild only be if incremental config
      if (builder.rebuild) {
        return builder.rebuild().then(() => {
          buildDone(esbuildConfig);
          callWebsocketClient(msg);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      } else {
        return build(esbuildConfig).then(() => {
          buildDone(esbuildConfig);
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
      send(msg);
      if (builder && builder.rebuild) {
        builder.rebuild().then(() => {
          buildDone(esbuildConfig);
          callWebsocketClient(msg);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      } else {
        build(esbuildConfig).then(() => {
          buildDone(esbuildConfig);
          callWebsocketClient(msg);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      }
    });
  }
}
