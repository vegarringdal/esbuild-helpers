import { html } from "lit-html";
import { customElement } from "@simple-html/core";
import { navs, routerConfig } from "./routerConfig";
import { connectHashChanges } from "@simple-html/router";

@customElement("childrouter-route")
export default class extends HTMLElement {
  connectedCallback() {
    connectHashChanges(this, this.render);
  }

  public render() {
    return html`
      <nav class="ani flex bg-indigo-700 p-6">
        ${navs("sub").map((route) => {
          if (route.isNav) {
            return html`
              <span class="mr-6">
                <a
                  class="text-green-200 hover:text-white hover:underline"
                  href="${route.href}"
                  >${route.title}</a
                >
              </span>
            `;
          } else {
            return "";
          }
        })}
      </nav>

      ${routerConfig.child.children.subHome.load()}
      ${routerConfig.child.children.subSettings.load()}
      ${routerConfig.child.children.protected.load()}
    `;
  }
}
