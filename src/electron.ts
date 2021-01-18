import { spawn } from "child_process";
import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";
import { publish, subscribe } from "./events";

let childSpawn: any;
type eletronArg = { argsBefore?: string[]; argsAfter?: string[] };

function logMsg(msg: string) {
  log(`ELECTRON`, msg);
}

function logMsgBuild(esbuildConfig: BuildOptions) {
  logMsg(`build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);
}

function runElectronApp(launchJs: string, electronArgs?: eletronArg) {
  function spawner(cmd: string, args: string[]) {
    childSpawn = spawn(cmd, ["./node_modules/electron/cli.js", ...args], {
      stdio: "ignore",
      cwd: process.cwd(),
      env: process.env,
    });
    childSpawn.on("exit", function (code: number) {
      logMsg(`app exit:${code || ''}`);
    });
  }

  let args = [launchJs];
  if (electronArgs && electronArgs.argsBefore) {
    args = electronArgs.argsBefore.concat(args);
  }

  if (electronArgs && electronArgs.argsBefore) {
    args = args.concat(electronArgs.argsBefore);
  }

  spawner("node", args);
}

type config = {
  watch: string;
  launch?: boolean;
  launchArg?: eletronArg;
  transmitt?: string;
  listen?: string;
};

export async function electron(
  config: config | null,
  esbuildConfig: BuildOptions
) {
  const builder = await build(esbuildConfig);
  logMsgBuild(esbuildConfig);

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", async (eventName, path) => {
      const msg = `file changed ${eventName}`;
      logMsg(msg);

      // rebuild only be if incremental config
      if (builder.rebuild) {
        if (childSpawn) {
          logMsg('Killing app');
          childSpawn.kill("SIGINT");
        }
        return builder.rebuild().then(() => {
          logMsgBuild(esbuildConfig);
          if (esbuildConfig.outfile && config.launch) {
            runElectronApp(esbuildConfig.outfile);
          }

          callWebsocketClient(msg);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      } else {
        // no increment, then we just build it
        return build(esbuildConfig).then(() => {
          logMsgBuild(esbuildConfig);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      }
    });
  }

  if (esbuildConfig.outfile && config && config.launch) {
    runElectronApp(esbuildConfig.outfile, config.launchArg);
  }

  if (config?.listen) {
    subscribe(config.listen, async function () {
      const msg = `subscribe event ${config.listen}`;
      logMsg(msg);
      if (builder && builder.rebuild) {
        builder.rebuild().then(() => {
          logMsgBuild(esbuildConfig);
          callWebsocketClient(msg);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      } else {
        build(esbuildConfig).then(() => {
          logMsgBuild(esbuildConfig);
          callWebsocketClient(msg);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      }
    });
  }
}
