"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
//import * as path from "path";
var frontends = new Set();
var version = require("../package.json").version;
if (require("electron-squirrel-startup"))
    electron_1.app.quit();
electron_1.app
    .whenReady()
    .then(function () {
    var frontend = new electron_1.BrowserWindow({
        width: 1980,
        height: 1080,
        x: 0,
        y: 0,
        title: "Sample (" + version + ") - no project selected",
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
    frontend.on("closed", function () {
        frontends.delete(frontend);
        if (frontends.size === 0) {
            electron_1.app.quit();
        }
    });
    frontends.add(frontend);
    frontend.on("closed", function () {
        electron_1.app.quit();
    });
})
    .catch(function (e) {
    console.log("what", e);
});
