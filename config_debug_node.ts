import {
  clearFolders,
  addDefaultIndex,
  server,
  client,
  postcss,
} from "./scripts/exported";

clearFolders("dist_client", "dist_server");

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
server(
  "./src_server/**/*.ts",
  false, 
  true,
  {
    color: true,
    define: {
      "process.env.NODE_ENV": '"development"',
    },
    entryPoints: ["./src_server/index.ts"],
    outfile: "./dist_server/index.js",
    minify: false,
    target: "node14",
    bundle: true,
    external: ["express"],
    platform: "node",
    sourcemap: true,
    logLevel: "error",
    incremental: true,
  },
  { argsBefore: ["--inspect-brk"] }
);

/**
 * client bundle
 */
client("./src_client/**/*.ts", false, {
  color: true,
  define: {
    "process.env.NODE_ENV": '"development"',
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
