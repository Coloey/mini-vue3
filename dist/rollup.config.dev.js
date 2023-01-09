"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _rollupPluginTypescript = _interopRequireDefault(require("rollup-plugin-typescript2"));

var _pluginNodeResolve = _interopRequireDefault(require("@rollup/plugin-node-resolve"));

var _pluginReplace = _interopRequireDefault(require("@rollup/plugin-replace"));

var _pluginCommonjs = _interopRequireDefault(require("@rollup/plugin-commonjs"));

var _rollupPluginSourcemaps = _interopRequireDefault(require("rollup-plugin-sourcemaps"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  input: "./packages/vue/src/index.ts",
  plugins: [(0, _pluginReplace["default"])({
    "process.env.NODE_ENV": JSON.stringify("development"),
    "process.env.VUE_ENV": JSON.stringify("browser"),
    "process.env.LANGUAGE": JSON.stringify(process.env.LAMGUAGE)
  }), (0, _pluginNodeResolve["default"])(), (0, _pluginCommonjs["default"])(), (0, _rollupPluginTypescript["default"])(), (0, _rollupPluginSourcemaps["default"])()],
  output: [{
    format: "cjs",
    file: "./packages/vue/dist/mini-vue3.cjs.js",
    sourcemap: true
  }, {
    name: "vue",
    format: "es",
    file: "/packages/vue/dist/mini-vue3.esm-bundler.js",
    sourcemap: true
  }],
  onwarn: function onwarn(msg, warn) {
    //忽略circular的错误
    if (!/Circular/.test(msg)) {
      warn(msg);
    }
  }
};
exports["default"] = _default;