import { spawn } from "child_process";
import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";

let childSpawn: any;
type eletronArg = { argsBefore?: string[]; argsAfter?: string[] };

function runElectronApp(launchJs: string, electronArgs?: eletronArg) {
  function spawner(cmd: string, args: string[]) {
    childSpawn = spawn(cmd, ["./node_modules/electron/cli.js", ...args], {
      stdio: "ignore",
      cwd: process.cwd(),
      env: process.env,
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
  // "./node_modules/electron/dist/electron.exe"
  spawner("node", args);
}

type config = {
  watch: string;
  launch?: boolean;
  launchArg?: eletronArg;
};

export async function electron(config: config|null, esbuildConfig: BuildOptions) {
  const builder = await build(esbuildConfig);
  log(
    `electron build done: ${esbuildConfig?.outfile || esbuildConfig?.outdir}`
  );

  if (config && config.watch) {
    chokidar.watch(config.watch, {}).on("change", async (eventName, path) => {
      const msg = `client file changed ${eventName}`;
      log(msg);

      // rebuild only be if incremental config
      if (builder.rebuild) {
        if (childSpawn) {
          childSpawn.kill("SIGINT");
        }
        return builder.rebuild().then(() => {
          if (esbuildConfig.outfile && config.launch) {
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
  if (esbuildConfig.outfile && config && config.launch) {
    runElectronApp(esbuildConfig.outfile, config.launchArg);
  }
}
