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
  print_runtime: true
});

checker_client.printSettings();
checker_client.inspectAndPrint();
checker_client.worker_watch("./");



const checker_nodejs = TypeChecker({
  basePath: "./src_nodejs",
  name: "checker_nodejs",
  tsConfigOverride: {
    compilerOptions: {
      rootDir: `./`,
      baseUrl: `./`,
      target: "es2018",
      module: "commonjs",
      esModuleInterop:true,
      lib: ["es2017", "dom"],
      experimentalDecorators: true,
    },
  },
  print_summary: true,
  print_runtime: true
});

checker_nodejs.printSettings();
checker_nodejs.inspectAndPrint();
checker_nodejs.worker_watch("./");




const checker_electron = TypeChecker({
  basePath: "./src_electron",
  name: "checker_electron",
  tsConfigOverride: {
    compilerOptions: {
      rootDir: `./`,
      baseUrl: `./`,
      target: "es2018",
      module: "commonjs",
      esModuleInterop:true,
      lib: ["es2017", "dom"],
      experimentalDecorators: true,
    },
  },
  print_summary: true,
  print_runtime: true
});

checker_electron.printSettings();
checker_electron.inspectAndPrint();
checker_electron.worker_watch("./");
