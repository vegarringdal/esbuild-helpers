import { TypeChecker, ITypeCheckerOptions } from "./src/exported";

const checker_client = TypeChecker({
  basePath: "./src_client",
  name: "checker_client",
  tsConfigOverride: {
    compilerOptions: {
      rootDir: `./`,
      baseUrl: `./`,
      target: "es2018",
      module: "commonjs",
      lib: ["es2017", "dom"],
      experimentalDecorators: true,
    },
  },
  print_summary: true,
  print_runtime: true,
});


checker_client.worker_watch("./");
