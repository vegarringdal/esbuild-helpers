import { ITypeCheckerOptions } from "./interfaces";
import * as chokidar from "chokidar";
import { getPath } from "./getPath";
import { debugPrint } from "./debugPrint";
import { C_Gray, C_Yellow, Logger, C_Reset } from "./logger";

let watchTimeout: any;

export function watchSrc(
  pathToWatch: string,
  options: ITypeCheckerOptions,
  callback: Function
) {
  debugPrint("watchSrc" + pathToWatch);
  let basePath = getPath(pathToWatch, options);

  const watch = chokidar.watch(basePath);
  // todo-> move into thread

  // tell user what path we are watching
  if (options.print_watchStarted) {
    Logger.info(`${C_Yellow}\nTypechecker watch mode activated: ${C_Reset}`);
  }

  let ready = false;

  watch.on("ready", (f: any /*, stat: any*/) => {
    ready = true;
  });

  // on created file event
  watch.on("add", (f: any /*, stat: any*/) => {
    if (ready) {
      Logger.info(`${C_Yellow}\nFile created: ${C_Gray}${f}`);
      callback();
    }
  });

  // on changed file event
  watch.on("change", (f: any /*, curr: any, prev: any*/) => {
    // tell user about event
    Logger.info(`${C_Yellow}\nFile changed: ${C_Gray}${f}`);

    // have inside timeout, so we only run once when multiple files are saved
    clearTimeout(watchTimeout);
    watchTimeout = setTimeout(() => {
      callback();
    }, 100);
  });

  watch.on("unlink", (f: any /*, stat: any*/) => {
    // tell user about event
    Logger.info(`${C_Yellow}\nFile removed: ${C_Gray}${f}`);
    Logger.info(`Calling typechecker`, C_Reset);

    // have inside timeout, so we only run once when multiple files are saved
    clearTimeout(watchTimeout);
    watchTimeout = setTimeout(() => {
      callback();
    }, 100);
  });
}
