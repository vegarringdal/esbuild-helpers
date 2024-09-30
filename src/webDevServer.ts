import express from "express";
const zlib = require('node:zlib');
import { log } from "./log";

let compression: any;
try {
  compression = require("compression");
} catch (err) {}

export function startDevServer(
  port: number,
  distFolder: string,
  publicFolders: string[],
  host: string
) {
  const app = express();

  if (compression) {
    app.use(
      compression({
        threshold: 1,
        flush: zlib.constants.Z_SYNC_FLUSH,
      })
    );
  }

  if (Array.isArray(publicFolders)) {
    publicFolders.forEach((folder) => {
      app.use(
        express.static(folder, {
          etag: false,
          maxAge: "5",
        })
      );
    });
  }

  app.use(
    express.static(distFolder, {
      etag: false,
      maxAge: "5",
    })
  );

  app.listen(port, () => {
    log(`DEVSERVER`, `http://${host || "localhost"}:` + port);
    log(`DEVSERVER`, `path: ${distFolder}:`);
  });
}
