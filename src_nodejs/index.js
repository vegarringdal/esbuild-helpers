"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var compression_1 = __importDefault(require("compression"));
var zlib_1 = require("zlib");
var app = express_1.default();
var port = 80;
app.use(compression_1.default({
    threshold: 1,
    flush: zlib_1.constants.Z_SYNC_FLUSH,
}));
app.use(express_1.default.static("./dist_client", {
    etag: false,
    maxAge: "5",
}));
app.listen(port, function () {
    console.log("Example app listening at http://localhost  :" + port);
});
