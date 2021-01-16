import { html } from "lit-html";
import { customElement } from "@simple-html/core";
import { gotoURL } from "@simple-html/router";
import { routerConfig } from "./routerConfig";
import { formState } from "../state/settingsState";

@customElement("login-route")
export default class extends HTMLElement {
  connectedCallback() {
    // connect to changes and call render
    formState.connectStateChanges(this, this.render);
  }

  private authToggelBtn() {
    const [, formSet] = formState.getState();
    formSet({ loggedin: isAuthenticted() ? false : true });

    // lets go to our login area
    gotoURL(routerConfig.child.children.protected.href);
  }

  public render() {
    
    return html`
      <section class="p-2">
        <h1>Auth component</h1>
        <button
          class="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click=${this.authToggelBtn}
        >
          ${isAuthenticted() ? "logout" : "login"}
        </button>
      </section>
    `;
  }
}

// some dummy funtions to simulate logout

export function isAuthenticted() {
  const form = formState.getValue();
  return form.loggedin;
}

export function setLogoutState() {
  const [, formSet] = formState.getState();
  formSet({ loggedin: false });
  gotoURL(""); // goto home is a good place
}
