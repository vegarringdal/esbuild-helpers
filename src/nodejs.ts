import { spawn } from "child_process";
import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";
import { subscribe, publish } from "./events";

let childSpawn: any;
type nodeArg = { argsBefore?: string[]; argsAfter?: string[] };

function send(msg: string) {
  log(`NODEJS`, msg);
}

function buildDone(esbuildConfig: BuildOptions) {
  send(`build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);
}

function runNodeApp(launchJs: string, nodeArgs?: nodeArg) {
  send('staring app');
  function spawner(cmd: string, args: string[]) {
    childSpawn = spawn(cmd, args, {
      stdio: "inherit",
      cwd: process.cwd(),
      env: process.env,
    });
    childSpawn.on("exit", function (code: number) {
      send(`app exit:${code || ''}`);
    });
  }

  let args = [launchJs];
  if (nodeArgs && nodeArgs.argsBefore) {
    args = nodeArgs.argsBefore.concat(args);
  }

  if (nodeArgs && nodeArgs.argsBefore) {
    args = args.concat(nodeArgs.argsBefore);
  }

  spawner("node", args);
}

type config = {
  watch: string;
  launch?: boolean;
  launchArg?: nodeArg;
  transmitt?: string;
  listen?: string;
};

export async function nodejs(
  config: config | null,
  esbuildConfig: BuildOptions
) {
  const builder = await build(esbuildConfig);
  buildDone(esbuildConfig);

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", async (eventName, path) => {
      const msg = `file changed ${eventName}`;
      send(msg);

      // rebuild only be if incremental config
      if (builder.rebuild) {
        return builder.rebuild().then(() => {
          buildDone(esbuildConfig);
          if (childSpawn) {
            send('killing app');
            childSpawn.kill("SIGINT");
          }

          if (esbuildConfig.outfile && config.launch) {
            runNodeApp(esbuildConfig.outfile);
          }

          if (config.transmitt) {
            publish(config.transmitt);
          }

          callWebsocketClient(msg);
        });
      } else {
        // no increment, then we just build it
        return build(esbuildConfig).then(() => {
          buildDone(esbuildConfig);
          if (config.transmitt) {
            publish(config.transmitt);
          }
        });
      }
    });
  }

  if (esbuildConfig.outfile && config && config.launch) {
    runNodeApp(esbuildConfig.outfile, config.launchArg);
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
