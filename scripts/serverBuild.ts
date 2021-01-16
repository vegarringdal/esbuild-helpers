import { spawn } from "child_process";
import { callWebsocketClient } from "./websocketServer";
import { build, BuildOptions } from "esbuild";
import chokidar from "chokidar";
import { log } from "./log";

let childSpawn: any;

function runNodeApp(launchJs: string) {
  function spawner(cmd: string, args: string[]) {
    childSpawn = spawn(cmd, args, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    childSpawn.on("exit", function (code: number) {
      log(`\nNode app failed:${code}\n`);
    });
  }
  spawner(process.platform === "win32" ? "node.exe" : "node", [launchJs]);
}

export async function server(watch: string, esbuildConfig: BuildOptions) {
  const builder = await build(esbuildConfig);

  chokidar.watch(watch, {}).on("change", async (eventName, path) => {
    const msg =`client file changed ${eventName}`
    log(msg);

    // rebuild only be if incremental config
    if (builder.rebuild) {
      return builder.rebuild().then(() => {
        childSpawn.kill();
        if (esbuildConfig.outfile) {
          runNodeApp(esbuildConfig.outfile);
        }

        callWebsocketClient(msg);
      });
    } else {
      // no increment, then we just build it
      return build(esbuildConfig);
    }
  });

  if (esbuildConfig.outfile) {
    runNodeApp(esbuildConfig.outfile);
  }
}
