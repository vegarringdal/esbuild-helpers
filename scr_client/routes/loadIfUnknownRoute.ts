import { routeMatch } from "@simple-html/router";
import { html } from "lit-html";
import { routerConfig } from "./routerConfig";

export function loadIfUnknownRoute() {
  const mainroute = Object.keys(routerConfig)
    .map((key) => routeMatch(routerConfig[key].href))
    .filter((e) => {
      return e === true;
    }).length;

  const childRoutes = routerConfig.child.children;
  const subroutes = Object.keys(childRoutes)
    .map((key) => routeMatch(childRoutes[key].href))
    .filter((e) => {
      return e === true;
    }).length;

  if (!mainroute && !subroutes && !routeMatch('')) {
    return html`<section class="p-2">
      <h1>unknown route</h1>
    </section>`;
  } else {
    return "";
  }
}
