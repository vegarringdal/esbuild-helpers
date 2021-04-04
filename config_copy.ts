import {
  copy
} from "./src/exported";

// see https://www.npmjs.com/package/globby for input patterns
copy('package*', './test')