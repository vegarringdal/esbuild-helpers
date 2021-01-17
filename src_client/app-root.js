"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lit_html_1 = require("lit-html");
var core_1 = require("@simple-html/core");
var routerConfig_1 = require("./routes/routerConfig");
var router_1 = require("@simple-html/router");
var login_1 = require("./routes/login");
require("./routes/routerConfig");
var loadIfUnknownRoute_1 = require("./routes/loadIfUnknownRoute");
var settingsState_1 = require("./state/settingsState");
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    default_1.prototype.connectedCallback = function () {
        router_1.connectHashChanges(this, this.render);
        settingsState_1.formState.connectStateChanges(this, this.render);
    };
    default_1.prototype.render = function () {
        var form = settingsState_1.formState.getValue();
        return lit_html_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      <nav class=\"flex bg-indigo-800  p-6\">\n        ", "\n\n        <!-- login/logout button -->\n        <span style=\"margin-left: auto;\" class=\"mr-6\">\n          <span\n            class=\"text-green-200 hover:text-white\"\n            @click=", "\n          >\n            ", "\n            <br />\n            ", "\n          </span>\n        </span>\n      </nav>\n\n      <!--  route -->\n      ", "\n      <!--  route -->\n      ", "\n      <!--  route -->\n      ", "\n      <!--  route -->\n      ", "\n      <!--  route -->\n      ", "\n    "], ["\n      <nav class=\"flex bg-indigo-800  p-6\">\n        ",
            "\n\n        <!-- login/logout button -->\n        <span style=\"margin-left: auto;\" class=\"mr-6\">\n          <span\n            class=\"text-green-200 hover:text-white\"\n            @click=",
            "\n          >\n            ", "\n            <br />\n            ", "\n          </span>\n        </span>\n      </nav>\n\n      <!--  route -->\n      ", "\n      <!--  route -->\n      ", "\n      <!--  route -->\n      ", "\n      <!--  route -->\n      ", "\n      <!--  route -->\n      ", "\n    "])), routerConfig_1.navs("main").map(function (route) {
            if (route.isNav) {
                return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n              <span class=\"mr-6\">\n                <a\n                \n                  class=\"text-yellow-200 hover:text-white hover:underline\"\n                  href=\"", "\"\n                  >", "</a\n                >\n              </span>\n            "], ["\n              <span class=\"mr-6\">\n                <a\n                \n                  class=\"text-yellow-200 hover:text-white hover:underline\"\n                  href=\"", "\"\n                  >", "</a\n                >\n              </span>\n            "])), route.href, route.title);
            }
            return "";
        }), function () {
            if (login_1.isAuthenticted()) {
                login_1.setLogoutState();
            }
            else {
                router_1.gotoURL("#:path", { path: "login" });
            }
        }, login_1.isAuthenticted() ? "Logout" : "Login", login_1.isAuthenticted() ? form.username || "not set" : "NA", routerConfig_1.routerConfig.home.load(), routerConfig_1.routerConfig.settings.load(), routerConfig_1.routerConfig.login.load(), routerConfig_1.routerConfig.child.load(), loadIfUnknownRoute_1.loadIfUnknownRoute());
    };
    default_1 = __decorate([
        core_1.customElement("app-root")
    ], default_1);
    return default_1;
}(HTMLElement));
exports.default = default_1;
var templateObject_1, templateObject_2;
