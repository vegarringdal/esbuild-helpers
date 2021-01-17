import {
  clearFolders,
  addDefaultIndex,
  nodejs,
  client,
  makeAllPackagesExternalPlugin,
  minifyHTMLLiteralsPlugin,
  postcssPlugin,
} from "./scripts/exported";

clearFolders("dist_client", "dist_nodejs");

/**
 * build our tailwind
 * this is slow, but rearly rebuild, so ok for now
 */
//@ts-ignore
process.env.PRODUCTION = true;

/**
 * nodejs bundle
 */
nodejs("./src_nodejs/**/*.ts", true, false, {
  color: true,
  define: {
    DEVELOPMENT: "false",
  },
  entryPoints: ["./src_nodejs/index.ts"],
  outfile: "./dist_nodejs/index.js",
  minify: true,
  target: "node14",
  bundle: true,
  plugins: [makeAllPackagesExternalPlugin],
  platform: "node",
  sourcemap: false,
  logLevel: "error",
  incremental: false,
});

client("./src_client/**/*.ts", true, {
  color: true,
  define: {
    DEVELOPMENT: "false",
  },
  entryPoints: ["./src_client/index.ts"],
  //outfile: "./dist_client/index.js",
  format: "esm",
  outdir: "./dist_client",
  plugins: [
    postcssPlugin([
      require("tailwindcss")("./tailwind.config.js"),
      require("autoprefixer"),
    ]),
    require("cssnano")({
      preset: "default",
    }),
  ],
  minify: true,
  bundle: true,
  target: "es2018",
  platform: "browser",
  sourcemap: false,
  splitting: true,
  logLevel: "error",
  incremental: false,
  treeShaking: true,
});

/**
 * index file for project
 */
addDefaultIndex(
  "dist_client",
  "./index.js",
  false,
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
