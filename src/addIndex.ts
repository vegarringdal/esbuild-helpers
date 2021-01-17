import rimraf from "rimraf";
import fs from "fs";
import path from "path";
import { log } from "./log";
import { startWebsocketServer } from "./websocketServer";

export function clearFolders(...folders: string[]) {
  folders.forEach((folder) => {
    rimraf.sync(folder);
  });
}

/**
 * adds index file with use template
 * user template need to have $bundle tag in header, so we can inject code
 * @param distFolder
 * @param entry
 * @param hbr - hot bundle reload, if false websocket server is not added/started
 * @param webSocketPort HBR needs to be active for this to run
 * @param indexTemplate
 * @param userInjectOnHbr
 */
export function addDefaultIndex(
  distFolder: string,
  entry: string,
  hbr: boolean,
  webSocketPort: number,
  indexTemplate: string,
  userInjectOnHbr: string
) {

  // make folder if it does not exist
  fs.mkdirSync(distFolder, { recursive: true });

  // if hbr then add start websocket server
  if (hbr) {
    startWebsocketServer(webSocketPort);
  }

  const normalBundle = `<script>import("${entry}")</script>`;

  const hbrBundle = `
    <script>
      let version = 0;
      import("${entry}?v=" + version);
      let connected = false;

      const websocketConnection = function () {
        const ws = new WebSocket("ws://localhost:${webSocketPort}");

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
          ${userInjectOnHbr && hbr? userInjectOnHbr : ""}
          
          version++;
          import("${entry}?v=" + version);
        });


      };
      websocketConnection();
    </script>`;

  fs.writeFileSync(
    path.resolve(distFolder, "index.html"),
    indexTemplate.replace("$bundle", hbr ? hbrBundle : normalBundle)
  );
  log("index added");
}
