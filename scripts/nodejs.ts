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

export async function nodejs(
  watch: string,
  production: Boolean,
  startNodejs: boolean,
  esbuildConfig: BuildOptions,
  nodeArgs?: nodeArg
) {
  const builder = await build(esbuildConfig);

  if (!production) {
    chokidar.watch(watch, {}).on("change", async (eventName, path) => {
      const msg = `client file changed ${eventName}`;
      log(msg);

      // rebuild only be if incremental config
      if (builder.rebuild) {
        return builder.rebuild().then(() => {
          if (childSpawn) {
            childSpawn.kill("SIGINT");
          }

          if (esbuildConfig.outfile && startNodejs) {
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
  if (esbuildConfig.outfile && startNodejs) {
    runNodeApp(esbuildConfig.outfile, nodeArgs);
  }
}
