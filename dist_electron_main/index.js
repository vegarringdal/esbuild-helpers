var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __commonJS = (callback, module2) => () => {
  if (!module2) {
    module2 = {exports: {}};
    callback(module2.exports, module2);
  }
  return module2.exports;
};
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// package.json
var require_package = __commonJS((exports2, module2) => {
  module2.exports = {
    name: "esbuild_testing",
    version: "1.0.0",
    description: "experiment with skipping traditional bundlers",
    scripts: {
      "nodejs:dev": "ts-node config_nodejs",
      "nodejs:prod": "ts-node config_nodejs_prod",
      "nodejs:prod:run": "ts-node config_nodejs_prod && node ./dist_nodejs/index.js",
      "nodejs:debug": "ts-node config_nodejs_debug",
      "electron:dev": "ts-node config_electron"
    },
    keywords: [],
    author: "Vegar Ringdal",
    license: "MIT",
    dependencies: {
      express: "^4.17.1",
      ws: "^7.4.2"
    },
    devDependencies: {
      "@simple-html/core": "^3.1.2",
      "@simple-html/datasource": "^3.1.2",
      "@simple-html/grid": "^3.1.2",
      "@simple-html/router": "^3.1.2",
      "@types/express": "^4.17.11",
      "@types/rimraf": "^3.0.0",
      "@types/ws": "^7.4.0",
      autoprefixer: "^10.2.1",
      chokidar: "^3.5.1",
      "custom-elements-hmr-polyfill": "^1.0.3",
      electron: "^11.2.0",
      "electron-squirrel-startup": "^1.0.0",
      esbuild: "^0.8.32",
      "lit-html": "^1.3.0",
      postcss: "^8.2.4",
      "postcss-cli": "^8.3.1",
      rimraf: "^3.0.2",
      tailwindcss: "^2.0.2",
      "ts-node": "^9.1.1",
      typescript: "^4.1.3"
    }
  };
});

// node_modules/ms/index.js
var require_ms = __commonJS((exports2, module2) => {
  var s = 1e3;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var y = d * 365.25;
  module2.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
      return parse(val);
    } else if (type === "number" && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
  };
  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch (type) {
      case "years":
      case "year":
      case "yrs":
      case "yr":
      case "y":
        return n * y;
      case "days":
      case "day":
      case "d":
        return n * d;
      case "hours":
      case "hour":
      case "hrs":
      case "hr":
      case "h":
        return n * h;
      case "minutes":
      case "minute":
      case "mins":
      case "min":
      case "m":
        return n * m;
      case "seconds":
      case "second":
      case "secs":
      case "sec":
      case "s":
        return n * s;
      case "milliseconds":
      case "millisecond":
      case "msecs":
      case "msec":
      case "ms":
        return n;
      default:
        return void 0;
    }
  }
  function fmtShort(ms) {
    if (ms >= d) {
      return Math.round(ms / d) + "d";
    }
    if (ms >= h) {
      return Math.round(ms / h) + "h";
    }
    if (ms >= m) {
      return Math.round(ms / m) + "m";
    }
    if (ms >= s) {
      return Math.round(ms / s) + "s";
    }
    return ms + "ms";
  }
  function fmtLong(ms) {
    return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
  }
  function plural(ms, n, name) {
    if (ms < n) {
      return;
    }
    if (ms < n * 1.5) {
      return Math.floor(ms / n) + " " + name;
    }
    return Math.ceil(ms / n) + " " + name + "s";
  }
});

// node_modules/debug/src/debug.js
var require_debug = __commonJS((exports2, module2) => {
  exports2 = module2.exports = createDebug.debug = createDebug["default"] = createDebug;
  exports2.coerce = coerce;
  exports2.disable = disable;
  exports2.enable = enable;
  exports2.enabled = enabled;
  exports2.humanize = require_ms();
  exports2.names = [];
  exports2.skips = [];
  exports2.formatters = {};
  var prevTime;
  function selectColor(namespace) {
    var hash = 0, i;
    for (i in namespace) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i);
      hash |= 0;
    }
    return exports2.colors[Math.abs(hash) % exports2.colors.length];
  }
  function createDebug(namespace) {
    function debug() {
      if (!debug.enabled)
        return;
      var self = debug;
      var curr = +new Date();
      var ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      args[0] = exports2.coerce(args[0]);
      if (typeof args[0] !== "string") {
        args.unshift("%O");
      }
      var index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
        if (match === "%%")
          return match;
        index++;
        var formatter = exports2.formatters[format];
        if (typeof formatter === "function") {
          var val = args[index];
          match = formatter.call(self, val);
          args.splice(index, 1);
          index--;
        }
        return match;
      });
      exports2.formatArgs.call(self, args);
      var logFn = debug.log || exports2.log || console.log.bind(console);
      logFn.apply(self, args);
    }
    debug.namespace = namespace;
    debug.enabled = exports2.enabled(namespace);
    debug.useColors = exports2.useColors();
    debug.color = selectColor(namespace);
    if (typeof exports2.init === "function") {
      exports2.init(debug);
    }
    return debug;
  }
  function enable(namespaces) {
    exports2.save(namespaces);
    exports2.names = [];
    exports2.skips = [];
    var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
    var len = split.length;
    for (var i = 0; i < len; i++) {
      if (!split[i])
        continue;
      namespaces = split[i].replace(/\*/g, ".*?");
      if (namespaces[0] === "-") {
        exports2.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
      } else {
        exports2.names.push(new RegExp("^" + namespaces + "$"));
      }
    }
  }
  function disable() {
    exports2.enable("");
  }
  function enabled(name) {
    var i, len;
    for (i = 0, len = exports2.skips.length; i < len; i++) {
      if (exports2.skips[i].test(name)) {
        return false;
      }
    }
    for (i = 0, len = exports2.names.length; i < len; i++) {
      if (exports2.names[i].test(name)) {
        return true;
      }
    }
    return false;
  }
  function coerce(val) {
    if (val instanceof Error)
      return val.stack || val.message;
    return val;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS((exports2, module2) => {
  exports2 = module2.exports = require_debug();
  exports2.log = log;
  exports2.formatArgs = formatArgs;
  exports2.save = save;
  exports2.load = load;
  exports2.useColors = useColors;
  exports2.storage = typeof chrome != "undefined" && typeof chrome.storage != "undefined" ? chrome.storage.local : localstorage();
  exports2.colors = [
    "lightseagreen",
    "forestgreen",
    "goldenrod",
    "dodgerblue",
    "darkorchid",
    "crimson"
  ];
  function useColors() {
    if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
      return true;
    }
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
  }
  exports2.formatters.j = function(v) {
    try {
      return JSON.stringify(v);
    } catch (err) {
      return "[UnexpectedJSONParseError]: " + err.message;
    }
  };
  function formatArgs(args) {
    var useColors2 = this.useColors;
    args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports2.humanize(this.diff);
    if (!useColors2)
      return;
    var c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    var index = 0;
    var lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, function(match) {
      if (match === "%%")
        return;
      index++;
      if (match === "%c") {
        lastC = index;
      }
    });
    args.splice(lastC, 0, c);
  }
  function log() {
    return typeof console === "object" && console.log && Function.prototype.apply.call(console.log, console, arguments);
  }
  function save(namespaces) {
    try {
      if (namespaces == null) {
        exports2.storage.removeItem("debug");
      } else {
        exports2.storage.debug = namespaces;
      }
    } catch (e) {
    }
  }
  function load() {
    var r;
    try {
      r = exports2.storage.debug;
    } catch (e) {
    }
    if (!r && typeof process !== "undefined" && "env" in process) {
      r = process.env.DEBUG;
    }
    return r;
  }
  exports2.enable(load());
  function localstorage() {
    try {
      return window.localStorage;
    } catch (e) {
    }
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS((exports2, module2) => {
  var tty = require("tty");
  var util = require("util");
  exports2 = module2.exports = require_debug();
  exports2.init = init;
  exports2.log = log;
  exports2.formatArgs = formatArgs;
  exports2.save = save;
  exports2.load = load;
  exports2.useColors = useColors;
  exports2.colors = [6, 2, 3, 4, 5, 1];
  exports2.inspectOpts = Object.keys(process.env).filter(function(key) {
    return /^debug_/i.test(key);
  }).reduce(function(obj, key) {
    var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
      return k.toUpperCase();
    });
    var val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val))
      val = true;
    else if (/^(no|off|false|disabled)$/i.test(val))
      val = false;
    else if (val === "null")
      val = null;
    else
      val = Number(val);
    obj[prop] = val;
    return obj;
  }, {});
  var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
  if (fd !== 1 && fd !== 2) {
    util.deprecate(function() {
    }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
  }
  var stream = fd === 1 ? process.stdout : fd === 2 ? process.stderr : createWritableStdioStream(fd);
  function useColors() {
    return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(fd);
  }
  exports2.formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
      return str.trim();
    }).join(" ");
  };
  exports2.formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
  };
  function formatArgs(args) {
    var name = this.namespace;
    var useColors2 = this.useColors;
    if (useColors2) {
      var c = this.color;
      var prefix = "  [3" + c + ";1m" + name + " [0m";
      args[0] = prefix + args[0].split("\n").join("\n" + prefix);
      args.push("[3" + c + "m+" + exports2.humanize(this.diff) + "[0m");
    } else {
      args[0] = new Date().toUTCString() + " " + name + " " + args[0];
    }
  }
  function log() {
    return stream.write(util.format.apply(util, arguments) + "\n");
  }
  function save(namespaces) {
    if (namespaces == null) {
      delete process.env.DEBUG;
    } else {
      process.env.DEBUG = namespaces;
    }
  }
  function load() {
    return process.env.DEBUG;
  }
  function createWritableStdioStream(fd2) {
    var stream2;
    var tty_wrap = process.binding("tty_wrap");
    switch (tty_wrap.guessHandleType(fd2)) {
      case "TTY":
        stream2 = new tty.WriteStream(fd2);
        stream2._type = "tty";
        if (stream2._handle && stream2._handle.unref) {
          stream2._handle.unref();
        }
        break;
      case "FILE":
        var fs = require("fs");
        stream2 = new fs.SyncWriteStream(fd2, {autoClose: false});
        stream2._type = "fs";
        break;
      case "PIPE":
      case "TCP":
        var net = require("net");
        stream2 = new net.Socket({
          fd: fd2,
          readable: false,
          writable: true
        });
        stream2.readable = false;
        stream2.read = null;
        stream2._type = "pipe";
        if (stream2._handle && stream2._handle.unref) {
          stream2._handle.unref();
        }
        break;
      default:
        throw new Error("Implement me. Unknown stream file type!");
    }
    stream2.fd = fd2;
    stream2._isStdio = true;
    return stream2;
  }
  function init(debug) {
    debug.inspectOpts = {};
    var keys = Object.keys(exports2.inspectOpts);
    for (var i = 0; i < keys.length; i++) {
      debug.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
    }
  }
  exports2.enable(load());
});

// node_modules/debug/src/index.js
var require_src = __commonJS((exports2, module2) => {
  if (typeof process !== "undefined" && process.type === "renderer") {
    module2.exports = require_browser();
  } else {
    module2.exports = require_node();
  }
});

// node_modules/electron-squirrel-startup/index.js
var require_electron_squirrel_startup = __commonJS((exports2, module2) => {
  var path = require("path");
  var spawn = require("child_process").spawn;
  var debug = require_src()("electron-squirrel-startup");
  var app2 = require("electron").app;
  var run = function(args, done) {
    var updateExe = path.resolve(path.dirname(process.execPath), "..", "Update.exe");
    debug("Spawning `%s` with args `%s`", updateExe, args);
    spawn(updateExe, args, {
      detached: true
    }).on("close", done);
  };
  var check = function() {
    if (process.platform === "win32") {
      var cmd = process.argv[1];
      debug("processing squirrel command `%s`", cmd);
      var target = path.basename(process.execPath);
      if (cmd === "--squirrel-install" || cmd === "--squirrel-updated") {
        run(["--createShortcut=" + target + ""], app2.quit);
        return true;
      }
      if (cmd === "--squirrel-uninstall") {
        run(["--removeShortcut=" + target + ""], app2.quit);
        return true;
      }
      if (cmd === "--squirrel-obsolete") {
        app2.quit();
        return true;
      }
    }
    return false;
  };
  module2.exports = check();
});

// src_electron_main/index.ts
var import_electron = __toModule(require("electron"));
var frontends = new Set();
var version = require_package().version;
if (require_electron_squirrel_startup())
  import_electron.app.quit();
import_electron.app.whenReady().then(() => {
  const frontend = new import_electron.BrowserWindow({
    width: 1980,
    height: 1080,
    x: 0,
    y: 0,
    title: `Sample (${version}) - no project selected`,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });
  frontend.loadFile("../dist_client/index.html");
  frontend.setMenuBarVisibility(true);
  frontend.webContents.openDevTools();
  frontend.on("closed", () => {
    frontends.delete(frontend);
    if (frontends.size === 0) {
      import_electron.app.quit();
    }
  });
  frontends.add(frontend);
  frontend.on("closed", () => {
    import_electron.app.quit();
  });
}).catch((e) => {
  console.log("what", e);
});
//# sourceMappingURL=index.js.map
