import { ChildProcess } from "child_process";
import { callWebsocketClient } from "./websocketServer";
import {
  build,
  BuildOptions,
  BuildResult,
  BuildContext,
  context,
} from "esbuild";
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
  let builder: BuildContext | BuildResult | null;

  // internal console log printer
  function logMsg(msg: string) {
    log(type, msg);
  }

  // internal console log printer
  function logBuildDone() {
    logMsg(`build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);
  }

  function buildError(error: any) {
    logMsg(
      `esbuild failed` + config?.printBuildError &&
        config?.printBuildError === true
        ? error
        : ""
    );
  }

  // helper for rebuilder
  async function makeBuilder(dev: boolean) {
    try {
      if (dev) {
        builder = await context(esbuildConfig);
        await builder.rebuild();
      } else {
        builder = await build(esbuildConfig);
      }
    } catch (e) {
      buildError(e);
    }
  }
  await makeBuilder(config?.watch !== undefined);

  logBuildDone();

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", async (eventName, path) => {
      const msg = `file changed ${eventName}`;
      logMsg(msg);

      if (!builder && config.watch) {
        await makeBuilder(config.watch !== undefined);
      }

      // rebuild only be if incremental config
      if (builder && (builder as BuildContext).rebuild) {
        // incremental build

        return (builder as BuildContext)
          .rebuild()
          .then(() => {
            logBuildDone();

            if (childSpawn) {
              logMsg("killing app");
              childSpawn.kill("SIGINT");
            }

            if (esbuildConfig.outfile && config.launch && type === "NODEJS") {
              childSpawn = runNodeApp(
                esbuildConfig.outfile,
                config.launchArg,
                (msg: string) => {
                  logMsg(msg);
                }
              );
            }

            if (esbuildConfig.outfile && config.launch && type === "ELECTRON") {
              childSpawn = runElectronApp(
                esbuildConfig.outfile,
                config.launchArg,
                (msg: string) => {
                  logMsg(msg);
                }
              );
            }

            if (config.transmitt) {
              publish(config.transmitt);
            }

            callWebsocketClient(msg);
          })
          .catch((e) => {
            // if this break then reset rebuild option
            buildError(e);
            builder = null;
          });
      } else {
        // no increment, then we just build it
        return build(esbuildConfig)
          .then(() => {
            logBuildDone();
            if (config.transmitt) {
              publish(config.transmitt);
            }
          })
          .catch((e) => {
            buildError(e);
          });
      }
    });
  }

  if (esbuildConfig.outfile && config && config.launch && type === "NODEJS") {
    childSpawn = runNodeApp(
      esbuildConfig.outfile,
      config.launchArg,
      (msg: string) => {
        logMsg(msg);
      }
    );
  }

  if (esbuildConfig.outfile && config && config.launch && type === "ELECTRON") {
    childSpawn = runElectronApp(
      esbuildConfig.outfile,
      config.launchArg,
      (msg: string) => {
        logMsg(msg);
      }
    );
  }

  if (config?.listen) {
    subscribe(config.listen, async function () {
      const msg = `subscribe event ${config.listen}`;
      logMsg(msg);

      if (!builder && config.watch) {
        await makeBuilder(config.watch !== undefined);
      }

      if (builder && (builder as BuildContext).rebuild) {
        // incremental build

        (builder as BuildContext)
          .rebuild()
          .then(() => {
            logBuildDone();
            callWebsocketClient(msg);
            if (config.transmitt) {
              publish(config.transmitt);
            }
          })
          .catch((e) => {
            buildError(e);
            builder = null;
          });
      } else {
        // normal build

        build(esbuildConfig)
          .then(() => {
            logBuildDone();
            callWebsocketClient(msg);
            if (config.transmitt) {
              publish(config.transmitt);
            }
          })
          .catch((e) => {
            buildError(e);
          });
      }
    });
  }
}
