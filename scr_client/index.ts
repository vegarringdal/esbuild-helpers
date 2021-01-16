import './index.css'
import { applyPolyfill, ReflowStrategy } from "custom-elements-hmr-polyfill";
applyPolyfill(ReflowStrategy.NONE);


import("./app-root").then(() => {
  // build app
  document.body.innerHTML = "<app-root></app-root>";
});



