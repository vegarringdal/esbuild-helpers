import { log } from "./log";
import { spawn } from "child_process";

const cmd = process.platform === "win32" ? "postcss.cmd" : "postcss";

/**
 * Simple helper to run postcss, I need this for my tailwindcss
 * PS! its so slow compared to esbuild
 * @param args
 */
export function postcss(args: any) {
  function spawner(cmd: string, args: string[]) {
    const childSpawn = spawn(cmd, args, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
    childSpawn.on("exit", function (code) {
      log(`\nPostcss failed:${code} \n`);
    });
  }
  spawner(cmd, args);
}
