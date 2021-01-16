import { html } from "lit-html";
import { customElement } from "@simple-html/core";
import { isAuthenticted } from "./login";
import { gotoURL } from "@simple-html/router";
import { formState } from "../state/settingsState";

@customElement("protected-route")
export default class extends HTMLElement {
  connectedCallback() {
    if (!isAuthenticted()) {
      gotoURL("#login");
    }
  }

  public render() {
    const [form, setForm] = formState.getState();
    return html`
      <section class="p-2">
        <h1>Welcome to the inner circle :-)</h1>

        <form class="flex flex-col">
          <label class="p-2 flex flex-col">
            Username:
            <input
              class="border border-gray-300 p-2"
              .value=${form.username || ""}
              @input=${(e: any) => setForm({ username: e.target.value })}
            />
          </label>
        </form>
      </section>
    `;
  }
}
