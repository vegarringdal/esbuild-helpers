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
var settingsState_1 = require("../state/settingsState");
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    default_1.prototype.render = function () {
        var form = settingsState_1.formState.getValue();
        return lit_html_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject([" <section class=\"p-2\">\n      <h1>home</h1>\n      <form class=\"flex flex-col\">\n        <h1 class=\"m-2 text-2xl\">Current State</h1>\n        \n        <label class=\"p-2 border-b border-gray-300\">\n          Username: ", "\n        </label>\n      </form>\n    </section>"], [" <section class=\"p-2\">\n      <h1>home</h1>\n      <form class=\"flex flex-col\">\n        <h1 class=\"m-2 text-2xl\">Current State</h1>\n        \n        <label class=\"p-2 border-b border-gray-300\">\n          Username: ", "\n        </label>\n      </form>\n    </section>"])), form.username || "");
    };
    default_1 = __decorate([
        core_1.customElement("home-route")
    ], default_1);
    return default_1;
}(HTMLElement));
exports.default = default_1;
var templateObject_1;
