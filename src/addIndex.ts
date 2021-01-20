import rimraf from "rimraf";
import fs from "fs";
import path from "path";
import { log } from "./log";
import { startWebsocketServer } from "./websocketServer";
import { startDevServer } from "./webDevServer";

export function clearFolders(...folders: string[]) {
  folders.forEach((folder) => {
    log("RM_FOLDER", folder);
    rimraf.sync(folder);
  });
}

type config = {
  distFolder: string;
  entry?: string;
  hbr?: boolean;
  devServer?: boolean;
  devServerPort?: number;
  webSocketPort?: number;
  indexTemplate?: string;
  userInjectOnHbr?: string;
  devServerStart?: boolean;
  devServerPath?: string;
  host?: string;
};

/**
 * adds index file with use template
 * user template need to have $bundle tag in header, so we can inject code
 * @param config
 */
export function addDefaultIndex(config: config) {
  // make folder if it does not exist
  fs.mkdirSync(config.distFolder, { recursive: true });

  // if hbr then add start websocket server
  if (config.hbr) {
    startWebsocketServer(config.webSocketPort || 8081);
  }

  const normalBundle = `<script>import("${config.entry}")</script>`;

  const hbrBundle = `
    <script>
      let version = 0;
      import("${config.entry}?v=" + version);
      let connected = false;

      const websocketConnection = function () {
        const ws = new WebSocket("ws://${config.host || "localhost"}:${
    config.webSocketPort || 8081
  }");

        ws.addEventListener("open", function () {
          connected = true;
          ws.send("connect");
        });

        ws.addEventListener("close", function () {
          connected = false;
          console.log("connection lost");
          websocketConnection();
        });

        ws.addEventListener("message", function (event) {
          ${config.userInjectOnHbr && config.hbr ? config.userInjectOnHbr : ""}
          
          version++;
          import("${config.entry}?v=" + version);
        });


      };
      websocketConnection();
    </script>`;
  if (config.indexTemplate) {
    fs.writeFileSync(
      path.resolve(config.distFolder, "index.html"),
      config.indexTemplate.replace(
        "$bundle",
        config.hbr ? hbrBundle : normalBundle
      )
    );
    log("ADD INDEX", "added");
  }

  if (config.devServer) {
    startDevServer(
      config.devServerPort || 8080,
      config.distFolder,
      config.host || "localhost"
    );

    if (config.devServerStart) {
      var url =
        `http://${config.host || "localhost"}:` +
        (config.devServerPort || 8080) +
        (config.devServerPath || "");
      var start =
        process.platform == "darwin"
          ? "open"
          : process.platform == "win32"
          ? "start"
          : "xdg-open";
      require("child_process").exec(start + " " + url);
    }
  }
}
