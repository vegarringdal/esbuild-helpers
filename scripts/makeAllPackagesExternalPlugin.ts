// https://github.com/evanw/esbuild/issues/619

export const makeAllPackagesExternalPlugin = {
    name: 'make-all-packages-external',
    setup(build:any) {
      let filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/ // Must not start with "/" or "./" or "../"
      build.onResolve({ filter }, (args:any) => ({ path: args.path, external: true }))
    },
  }