import { spawn } from "child_process";
import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";

let childSpawn: any;
type nodeArg = { argsBefore?: string[]; argsAfter?: string[] };

function runNodeApp(launchJs: string, nodeArgs?: nodeArg) {
  function spawner(cmd: string, args: string[]) {
    childSpawn = spawn(cmd, args, {
      stdio: "inherit",
      cwd: process.cwd(),
      env: process.env,
    });
    childSpawn.on("exit", function (code: number) {
      log(`\nNode app failed:${code}\n`);
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
};

export async function nodejs(config: config | null, esbuildConfig: BuildOptions) {
  const builder = await build(esbuildConfig);
  log(`nodejs build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`);

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", async (eventName, path) => {
      const msg = `client file changed ${eventName}`;
      log(msg);

      // rebuild only be if incremental config
      if (builder.rebuild) {
        return builder.rebuild().then(() => {
          if (childSpawn) {
            childSpawn.kill("SIGINT");
          }

          if (esbuildConfig.outfile && config.launch) {
            runNodeApp(esbuildConfig.outfile);
          }

          callWebsocketClient(msg);
        });
      } else {
        // no increment, then we just build it
        return build(esbuildConfig);
      }
    });
  }
  if (esbuildConfig.outfile && config && config.launch) {
    runNodeApp(esbuildConfig.outfile, config.launchArg);
  }
}
