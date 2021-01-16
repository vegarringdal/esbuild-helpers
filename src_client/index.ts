import "./index.css";

if (DEVELOPMENT) {
  console.log("dev");
  const {
    applyPolyfill,
    ReflowStrategy,
  } = require("custom-elements-hmr-polyfill");
  applyPolyfill(ReflowStrategy.NONE);
}

import("./app-root").then(() => {
  // build app
  document.body.innerHTML = "<app-root></app-root>";
});
