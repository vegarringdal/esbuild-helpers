import {
  clearFolders,
  addDefaultIndex,
  nodejs,
  client,
  makeAllPackagesExternalPlugin,
  minifyHTMLLiteralsPlugin,
  postcssPlugin,
  single,
} from "./src/exported";

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

/**
 * css
 */
single("./src_client/**/*.css", true, {
  color: true,
  define: {
    DEVELOPMENT: "true",
  },
  entryPoints: ["./src_client/index.css"],
  outfile: "./dist_client/index.css",
  plugins: [
    postcssPlugin([
      require("tailwindcss")("./tailwind.config.js"),
      require("cssnano"),
    ]),
  ],
  logLevel: "error",
  incremental: true,
});

client("./src_client/**/*.ts", true, {
  color: true,
  define: {
    DEVELOPMENT: "false",
  },
  entryPoints: ["./src_client/index.ts"],
  format: "esm",
  outdir: "./dist_client",
  minify: true,
  bundle: true,
  plugins: [minifyHTMLLiteralsPlugin()],
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
       
        $bundle
      </head>
      <body>
      </body>
      </html>
      `,
  'window.dispatchEvent(new CustomEvent("SIMPLE_HTML_SAVE_STATE"));'
);
