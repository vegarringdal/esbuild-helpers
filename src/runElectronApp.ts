import { spawn } from "child_process";
import { eletronArg } from "./interfaces";

export function runElectronApp(
  launchJs: string,
  electronArgs: eletronArg | null = {},
  msgCallback: (msg: string) => void
) {
  let args = [launchJs];
  if (electronArgs && electronArgs.argsBefore) {
    args = electronArgs.argsBefore.concat(args);
  }

  if (electronArgs && electronArgs.argsBefore) {
    args = args.concat(electronArgs.argsBefore);
  }

  msgCallback("staring app");
  const childSpawn = spawn(
    "node",
    ["./node_modules/electron/cli.js", ...args],
    {
      stdio: "ignore",
      cwd: process.cwd(),
      env: process.env,
    }
  ).on("exit", function (code: number) {
    msgCallback(`app exit:${code || ""}`);
  });

  return childSpawn;
}
