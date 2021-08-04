# esbuild-helpers

Simple helper lib to help make js bundles

`npm install esbuild-helpers --save-dev`

### Docs

Atm see config files at root for how to use.

* `npm run copy`
  * Shows how to copy files
  * Code: `config_copy.ts`
* `npm run nodejs:dev`
  * Shows how to run nodejs with restart on changes
  * Code: `config_nodejs.ts`
* `npm run nodejs:prod`
  * Shows how to make productioin build for nodejs
  * Code: `config_nodejs_prod.ts`
* `npm run nodejs:prod:run`
  * Shows how to runn nodejs production build
  * Code: `config_nodejs_prod && node ./dist_nodejs/index.js`
* `npm run nodejs:debug`
  * Shows how to run nodejs with debug activated
  * Code: `config_nodejs_debug.ts`
* `npm run nodejs:events`
  * Shows how to trigger events between the builds
  * Code: `config_nodejs_event.ts`

* `npm run devserver`
  * Shows how run simple dev server (reloads js withour browser reload)
  * Code: `config_devserver.ts`
* `npm run electron:dev`
  * Shows how run electron
  * Code: `config_electron.ts`
* `npm run typechecker`
  * Shows how to run typechecking
  * Code: `config_type.ts`



You need to have this installed:

- esbuild
- typescript
- postcss (will just warn if missing)
- minify-html-literals (will just warn if missing)
- compression (will skip if missing)

Have these ass dev dependencies so user can use newer version/not dependant of this
