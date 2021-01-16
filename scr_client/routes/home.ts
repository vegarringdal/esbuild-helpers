import { html } from "lit-html";
import { customElement } from "@simple-html/core";
import { formState } from "../state/settingsState";


@customElement("home-route")
export default class extends HTMLElement {
  public render() {

    const form = formState.getValue();
    return html` <section class="p-2">
      <h1>home</h1>
      <form class="flex flex-col">
        <h1 class="m-2 text-2xl">Current State</h1>
        Login to edit (protected route)
        <label class="p-2 border-b border-gray-300">
          Username: ${form.username || ""}
        </label>
      </form>
    </section>`;
  }
}
