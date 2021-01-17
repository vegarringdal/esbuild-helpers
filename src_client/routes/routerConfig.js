"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.href = exports.navs = exports.routerConfig = void 0;
var router_1 = require("@simple-html/router");
var lit_html_1 = require("lit-html");
router_1.startRouter();
exports.routerConfig = {
    home: {
        path: "",
        href: "#",
        title: "Home",
        fetch: function () { return Promise.resolve().then(function () { return __importStar(require("./home")); }); },
        html: lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject([" <home-route></home-route> "], [" <home-route></home-route> "]))),
        isNav: true,
        load: function () {
            return router_1.routeMatchAsync(this.path, this.fetch, this.html);
        },
    },
    settings: {
        path: "#settings",
        href: "#settings",
        title: "Settings",
        fetch: function () { return Promise.resolve().then(function () { return __importStar(require("./settings")); }); },
        html: lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject([" <settings-route></settings-route> "], [" <settings-route></settings-route> "]))),
        isNav: true,
        load: function () {
            return router_1.routeMatchAsync(this.path, this.fetch, this.html);
        },
    },
    login: {
        path: "#login",
        href: "#login",
        title: "Auth",
        fetch: function () { return Promise.resolve().then(function () { return __importStar(require("./login")); }); },
        html: lit_html_1.html(templateObject_3 || (templateObject_3 = __makeTemplateObject([" <login-route></login-route>"], [" <login-route></login-route>"]))),
        isNav: false,
        load: function () {
            return router_1.routeMatchAsync(this.path, this.fetch, this.html);
        },
    },
    child: {
        path: "#child/*",
        href: "#child/",
        title: "ChildRoute",
        fetch: function () { return Promise.resolve().then(function () { return __importStar(require("./childrouter")); }); },
        html: lit_html_1.html(templateObject_4 || (templateObject_4 = __makeTemplateObject([" <childrouter-route></childrouter-route> "], [" <childrouter-route></childrouter-route> "]))),
        isNav: true,
        load: function () {
            return router_1.routeMatchAsync(this.path, this.fetch, this.html);
        },
        children: {
            subHome: {
                path: "#child/",
                href: "#child/",
                title: "Sub Home",
                fetch: function () { return Promise.resolve().then(function () { return __importStar(require("./home")); }); },
                html: lit_html_1.html(templateObject_5 || (templateObject_5 = __makeTemplateObject(["<home-route></home-route> "], ["<home-route></home-route> "]))),
                isNav: true,
                load: function () {
                    return router_1.routeMatchAsync(this.path, this.fetch, this.html);
                },
            },
            subSettings: {
                path: "#child/settings",
                href: "#child/settings",
                title: "Sub Settings",
                fetch: function () { return Promise.resolve().then(function () { return __importStar(require("./settings")); }); },
                html: lit_html_1.html(templateObject_6 || (templateObject_6 = __makeTemplateObject(["<settings-route></settings-route>"], ["<settings-route></settings-route>"]))),
                isNav: true,
                load: function () {
                    return router_1.routeMatchAsync(this.path, this.fetch, this.html);
                },
            },
            protected: {
                path: "#child/protected",
                href: "#child/protected",
                title: "Sub Protected",
                fetch: function () { return Promise.resolve().then(function () { return __importStar(require("./protected")); }); },
                html: lit_html_1.html(templateObject_7 || (templateObject_7 = __makeTemplateObject([" <protected-route></protected-route> "], [" <protected-route></protected-route> "]))),
                isNav: true,
                load: function () {
                    return router_1.routeMatchAsync(this.path, this.fetch, this.html);
                },
            },
        },
    },
};
// small helper to get routes
function navs(router) {
    if (router === "main") {
        return Object.keys(exports.routerConfig).map(function (key) { return exports.routerConfig[key]; });
    }
    else {
        var childRoutes_1 = exports.routerConfig.child.children;
        return Object.keys(childRoutes_1).map(function (key) { return childRoutes_1[key]; });
    }
}
exports.navs = navs;
function href(param) {
    return param;
}
exports.href = href;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
