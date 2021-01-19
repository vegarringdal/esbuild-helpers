import { spawn } from "child_process";
import { nodeArg } from "./interfaces";

export function runNodeApp(
  launchJs: string,
  nodeArgs: nodeArg | null = {},
  msgCallback: (msg: string) => void
) {
  let args = [launchJs];
  if (nodeArgs && nodeArgs.argsBefore) {
    args = nodeArgs.argsBefore.concat(args);
  }

  if (nodeArgs && nodeArgs.argsBefore) {
    args = args.concat(nodeArgs.argsBefore);
  }

  msgCallback("staring app");
  const childSpawn = spawn("node", args, {
    stdio: "inherit",
    cwd: process.cwd(),
    env: process.env,
  }).on("exit", function (code: number) {
    msgCallback(`app exit:${code || ""}`);
  });

  return childSpawn;
}
