import fs from "fs";
import path from "path";

let minifyHTMLLiterals: any;
try {
  minifyHTMLLiterals = require("minify-html-literals");
} catch (err) {}

const readFile = (file: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(file), "UTF8", (err: any, data: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export function minifyHTMLLiteralsPlugin(config = {}) {
  return {
    name: "minifyHTMLLiterals-Plugin",
    setup(build: any) {
      build.onLoad({ filter: /\.ts$/ }, (args: any) => {
        return new Promise<any>(async (resolve) => {
          const text = await readFile(args.path);
          let result: any;
          try {
            result = minifyHTMLLiterals(text, config);
          } catch (e) {
            if (!minifyHTMLLiterals) {
              console.log(
                "\nminify HTML Literals module is missing, try npm install minify-html-literals\n",
                args.path,
                "\n"
              );
            } else {
              console.log(e, result);
            }
          }
          if (!result) {
            resolve(undefined);
          }
          resolve({ contents: result?.code, loader: "ts" });
        });
      });
    },
  };
}
