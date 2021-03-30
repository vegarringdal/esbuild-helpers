import {
  clearFolders,
  addDefaultIndex,
  electron,
  client,
  makeAllPackagesExternalPlugin,
  postcssPlugin,
  single,
} from "./src/exported";

clearFolders("dist_client", "dist_electron_main");

/**
 * css so we dont need to wait for postcss unless we change css..
 */
single(
  { watch: "./src_client/**/*.css" },
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
    },
    entryPoints: ["./src_client/index.css"],
    outfile: "./dist_client/index.css",
    plugins: [postcssPlugin([require("tailwindcss")("./tailwind.config.js")])],
    logLevel: "error",
    incremental: true,
  }
);

/**
 * client bundle
 */
client(
  { watch: "./src_client/**/*.ts" },
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
    },
    entryPoints: ["./src_client/index.ts"],
    outfile: "./dist_client/index.js",
    minify: false,
    bundle: true,
    platform: "browser",
    sourcemap: true,
    logLevel: "error",
    incremental: true,
  }
);

/**
 * index file for project
 */
addDefaultIndex({
  distFolder: "dist_client",
  entry: "./index.js",
  publicFolders:[],
  hbr: true,
  webSocketPort: 8080,
  userInjectOnHbr:
    'window.dispatchEvent(new CustomEvent("SIMPLE_HTML_SAVE_STATE"));',
  indexTemplate: /*html*/ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <link href="./index.css" rel="stylesheet" />
       
        $bundle
      </head>
      <body>
      </body>
      </html>
      `,
});

/**
 * electron bundle
 */
electron(
  { watch: "./src_electron_main/**/*.ts", launch: true },
  {
    color: true,
    define: {
      DEVELOPMENT: "true",
    },
    entryPoints: ["./src_electron_main/index.ts"],
    outfile: "./dist_electron_main/index.js",
    minify: false,
    target: "node14",
    bundle: true,
    plugins: [makeAllPackagesExternalPlugin],
    platform: "node",
    sourcemap: true,
    logLevel: "error",
    incremental: true,
  }
);
