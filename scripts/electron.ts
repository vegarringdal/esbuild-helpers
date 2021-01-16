import { spawn } from "child_process";
import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";

let childSpawn: any;
type eletronArg = { argsBefore?: string[]; argsAfter?: string[] };

function runElectronApp(launchJs: string, electronArgs?: eletronArg) {
  function spawner(cmd: string, args: string[]) {
    childSpawn = spawn(cmd, args, {
      stdio: "ignore",
      cwd: process.cwd(),
      env: process.env
    });
    childSpawn.on("exit", function (code: number) {
      log(`\nElectron app failed:${code}\n`);
    });
  }

  let args = [launchJs];
  if (electronArgs && electronArgs.argsBefore) {
    args = electronArgs.argsBefore.concat(args);
  }

  if (electronArgs && electronArgs.argsBefore) {
    args = args.concat(electronArgs.argsBefore);
  }

  spawner(process.platform === "win32" ? "electron.cmd" : "electron", args);
}

export async function electron(
  watch: string,
  production: Boolean,
  startNodejs: boolean,
  esbuildConfig: BuildOptions,
  nodeArgs?: eletronArg
) {
  const builder = await build(esbuildConfig);

  if (!production) {
    chokidar.watch(watch, {}).on("change", async (eventName, path) => {
      const msg = `client file changed ${eventName}`;
      log(msg);

      // rebuild only be if incremental config
      if (builder.rebuild) {
        if (childSpawn) {
          childSpawn.kill();
        }
        return builder.rebuild().then(() => {
          if (esbuildConfig.outfile && startNodejs) {
            runElectronApp(esbuildConfig.outfile);
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
    runElectronApp(esbuildConfig.outfile, nodeArgs);
  }
}
