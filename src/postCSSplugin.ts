import postcss from "postcss";
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

export function postcssPlugin(plugins?: any[], options?: any) {
  return {
    name: "postcssPlugin-Plugin",
    setup(build: any) {
      build.onLoad({ filter: /\.css$/ }, (args: any) => {
        return new Promise<any>(async (resolve) => {
          const text = await readFile(args.path);
          let result: any;
          try {
            result = await postcss(plugins).process(text, {
              from: args.path,
            });
          } catch (e) {
            console.log(e, result);
          }
          resolve({ contents: result.css, loader: "css" });
        });
      });
    },
  };
}
