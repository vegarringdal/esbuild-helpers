import { ChildProcess } from "child_process";
import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions, BuildResult } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";
import { publish, subscribe } from "./events";
import { builderConfig, builderType } from "./interfaces";
import { runNodeApp } from "./runNodeApp";
import { runElectronApp } from "./runElectronApp";

export async function builder(
  type: builderType,
  config: builderConfig | null,
  esbuildConfig: BuildOptions
) {
  let childSpawn: ChildProcess;
  let builder: BuildResult | null;

  function send(msg: string) {
    log(type, msg);
  }

  function sendBuildDone() {
    send(`build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);
  }

  async function makeBuilder() {
    try {
      builder = await build(esbuildConfig);
    } catch (e) {
      send("esbuild failed");
    }
  }

  await makeBuilder();

  sendBuildDone();

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", async (eventName, path) => {
      const msg = `file changed ${eventName}`;
      send(msg);

      if (!builder && esbuildConfig.incremental) {
        await makeBuilder();
      }

      // rebuild only be if incremental config
      if (builder && builder.rebuild) {
        // incremental build

        return builder
          .rebuild()
          .then(() => {
            sendBuildDone();
            if (childSpawn) {
              send("killing app");
              childSpawn.kill("SIGINT");
            }

            if (esbuildConfig.outfile && config.launch && type === "NODEJS") {
              childSpawn = runNodeApp(
                esbuildConfig.outfile,
                config.launchArg,
                (msg: string) => {
                  send(msg);
                }
              );
            }

            if (esbuildConfig.outfile && config.launch && type === "ELECTRON") {
              childSpawn = runElectronApp(
                esbuildConfig.outfile,
                config.launchArg,
                (msg: string) => {
                  send(msg);
                }
              );
            }

            if (config.transmitt) {
              publish(config.transmitt);
            }

            callWebsocketClient(msg);
          })
          .catch(() => {
            // if this break then reset rebuild option
            send("esbuild failed");
            builder = null;
          });
      } else {
        // no increment, then we just build it
        return build(esbuildConfig)
          .then(() => {
            sendBuildDone();
            if (config.transmitt) {
              publish(config.transmitt);
            }
          })
          .catch(() => {
            send("esbuild failed");
          });
      }
    });
  }

  if (esbuildConfig.outfile && config && config.launch) {
    runNodeApp(esbuildConfig.outfile, config.launchArg, (msg: string) => {
      send(msg);
    });
  }

  if (config?.listen) {
    subscribe(config.listen, async function () {
      const msg = `subscribe event ${config.listen}`;
      send(msg);

      if (!builder && esbuildConfig.incremental) {
        await makeBuilder();
      }

      if (builder && builder.rebuild) {
        // incremental build

        builder
          .rebuild()
          .then(() => {
            sendBuildDone();
            callWebsocketClient(msg);
            if (config.transmitt) {
              publish(config.transmitt);
            }
          })
          .catch(() => {
            send("esbuild failed");
            builder = null;
          });
      } else {
        // normal build

        build(esbuildConfig)
          .then(() => {
            sendBuildDone();
            callWebsocketClient(msg);
            if (config.transmitt) {
              publish(config.transmitt);
            }
          })
          .catch(() => {
            send("esbuild failed");
          });
      }
    });
  }
}
