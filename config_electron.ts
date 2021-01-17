import {
  clearFolders,
  addDefaultIndex,
  electron,
  client,
  postcss,
  makeAllPackagesExternalPlugin
} from "./scripts/exported";

clearFolders("dist_client", "dist_electron_main");

/**
 * build our tailwind
 * this is slow, but rearly rebuild, so ok for now
 */
postcss([
  "./src_client/tailwind.css",
  "-o",
  "./dist_client/tailwind.css",
  "-w",
]);

/**
 * server bundle
 */
electron("./src_electron_main/**/*.ts", false, true, {
  color: true,
  define: {
    "DEVELOPMENT": "true",
  },
  entryPoints: ["./src_electron_main/index.ts"],
  outfile: "./dist_electron_main/index.js",
  minify: false,
  target: "node14",
  bundle: true,
  plugins:[makeAllPackagesExternalPlugin],
  platform: "node",
  sourcemap: true,
  logLevel: "error",
  incremental: true,
});

/**
 * client bundle
 */
client("./src_client/**/*.ts", false, {
  color: true,
  define: {
    "DEVELOPMENT": "true",
  },
  entryPoints: ["./src_client/index.ts"],
  outfile: "./dist_client/index.js",
  minify: false,
  bundle: true,
  platform: "browser",
  sourcemap: true,
  logLevel: "error",
  incremental: true,
});

/**
 * index file for project
 */
addDefaultIndex(
  "dist_client",
  "./index.js",
  true,
  8080,
  /*html*/ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link href="./index.css" rel="stylesheet" />
        <link href="./tailwind.css" rel="stylesheet" />
        $bundle
      </head>
      <body>
      </body>
      </html>
      `,
  'window.dispatchEvent(new CustomEvent("SIMPLE_HTML_SAVE_STATE"));'
);
