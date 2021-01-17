"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadIfUnknownRoute = void 0;
var router_1 = require("@simple-html/router");
var lit_html_1 = require("lit-html");
var routerConfig_1 = require("./routerConfig");
function loadIfUnknownRoute() {
    var mainroute = Object.keys(routerConfig_1.routerConfig)
        .map(function (key) { return router_1.routeMatch(routerConfig_1.routerConfig[key].href); })
        .filter(function (e) {
        return e === true;
    }).length;
    var childRoutes = routerConfig_1.routerConfig.child.children;
    var subroutes = Object.keys(childRoutes)
        .map(function (key) { return router_1.routeMatch(childRoutes[key].href); })
        .filter(function (e) {
        return e === true;
    }).length;
    if (!mainroute && !subroutes && !router_1.routeMatch('')) {
        return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<section class=\"p-2\">\n      <h1>unknown route</h1>\n    </section>"], ["<section class=\"p-2\">\n      <h1>unknown route</h1>\n    </section>"])));
    }
    else {
        return "";
    }
}
exports.loadIfUnknownRoute = loadIfUnknownRoute;
var templateObject_1;
