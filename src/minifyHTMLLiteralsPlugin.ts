import { minifyHTMLLiterals } from "minify-html-literals";
import fs from "fs";
import path from "path";

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
            console.log(e, result);
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
