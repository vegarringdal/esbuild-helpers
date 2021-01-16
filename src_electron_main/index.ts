import { app, BrowserWindow } from "electron";
//import * as path from "path";

const frontends = new Set<BrowserWindow>();
const version = require("../package.json").version;
if (require("electron-squirrel-startup")) app.quit();

app
  .whenReady()
  .then(() => {
    const frontend = new BrowserWindow({
      width: 1980,
      height: 1080,
      x: 0,
      y: 0,
      title: `Sample (${version}) - no project selected`,
      webPreferences: {
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        nodeIntegrationInSubFrames: false,
        contextIsolation: true,
        enableRemoteModule: false,
      },
    });

    frontend.loadFile("../dist_client/index.html");
    frontend.setMenuBarVisibility(true);

    frontend.webContents.openDevTools();

    frontend.on("closed", () => {
      frontends.delete(frontend);
      if (frontends.size === 0) {
        app.quit();
      }
    });

    frontends.add(frontend);

    frontend.on("closed", () => {
      app.quit();
    });
  })
  .catch((e) => {
    console.log("what", e);
  });
