import {
  clearFolders,
  addDefaultIndex,
  nodejs,
  client,
  makeAllPackagesExternalPlugin,
  postcssPlugin,
  single,
} from "./src/exported";

clearFolders("dist_client", "dist_nodejs");


//@ts-ignore
process.env.PRODUCTION = true; // for tailwind..

/**
 * nodejs bundle
 */
nodejs(null, {
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
  logLevel: "error"
});



/**
 * css so we dont need to wait for postcss unless we change css..
 */
single(null, {
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
  logLevel: "error"
});

client(null, {
  color: true,
  define: {
    DEVELOPMENT: "false",
  },
  entryPoints: ["./src_client/index.ts"],
  format: "esm",
  outdir: "./dist_client",
  minify: true,
  bundle: true,
  plugins: [],
  target: "es2018",
  platform: "browser",
  sourcemap: false,
  splitting: true,
  logLevel: "error",
  treeShaking: true,
});

/**
 * index file for project
 */
addDefaultIndex({
  distFolder: "dist_client",
  publicFolders:[],
  entry: "./index.js",
  hbr: false,
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
