import { startRouter, routeMatchAsync } from "@simple-html/router";
import { html } from "lit-html";
startRouter();

export const routerConfig = {
  home: {
    path: "",
    href: "#",
    title: "Home",
    fetch: () => import("./home"),
    html: html` <home-route></home-route> `,
    isNav: true,
    load: function () {
      return routeMatchAsync(this.path, this.fetch, this.html);
    },
  },
  settings: {
    path: "#settings",
    href: "#settings",
    title: "Settings",
    fetch: () => import("./settings"),
    html: html` <settings-route></settings-route> `,
    isNav: true,
    load: function () {
      return routeMatchAsync(this.path, this.fetch, this.html);
    },
  },
  login: {
    path: "#login",
    href: "#login",
    title: "Auth",
    fetch: () => import("./login"),
    html: html` <login-route></login-route>`,
    isNav: false,
    load: function () {
      return routeMatchAsync(this.path, this.fetch, this.html);
    },
  },
  child: {
    path: "#child/*",
    href: "#child/",
    title: "ChildRoute",
    fetch: () => import("./childrouter"),
    html: html` <childrouter-route></childrouter-route> `,
    isNav: true,
    load: function () {
      return routeMatchAsync(this.path, this.fetch, this.html);
    },
    children: {
      subHome: {
        path: "#child/",
        href: "#child/",
        title: "Sub Home",
        fetch: () => import("./home"),
        html: html`<home-route></home-route> `,
        isNav: true,
        load: function () {
          return routeMatchAsync(this.path, this.fetch, this.html);
        },
      },
      subSettings: {
        path: "#child/settings",
        href: "#child/settings",
        title: "Sub Settings",
        fetch: () => import("./settings"),
        html: html`<settings-route></settings-route>`,
        isNav: true,
        load: function () {
          return routeMatchAsync(this.path, this.fetch, this.html);
        },
      },
      protected: {
        path: "#child/protected",
        href: "#child/protected",
        title: "Sub Protected",
        fetch: () => import("./protected"),
        html: html` <protected-route></protected-route> `,
        isNav: true,
        load: function () {
          return routeMatchAsync(this.path, this.fetch, this.html);
        },
      },
    },
  },
};

// small helper to get routes
export function navs(router: "sub" | "main") {
  if (router === "main") {
    return Object.keys(routerConfig).map((key) => routerConfig[key]);
  } else {
    const childRoutes = routerConfig.child.children;
    return Object.keys(childRoutes).map((key) => childRoutes[key]);
  }
}

export function href(param: string) {
  return param;
}


