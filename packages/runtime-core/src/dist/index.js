"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
__exportStar(require("./h"), exports);
__exportStar(require("./createApp"), exports);
var component_1 = require("./component");
__createBinding(exports, component_1, "getCurrentInstance");
__createBinding(exports, component_1, "registerRuntimeCompiler");
var apiInject_1 = require("./apiInject");
__createBinding(exports, apiInject_1, "inject");
__createBinding(exports, apiInject_1, "provide");
var renderSlot_1 = require("./helpers/renderSlot");
__createBinding(exports, renderSlot_1, "renderSlot");
var vnode_1 = require("./vnode");
__createBinding(exports, vnode_1, "createTextVNode");
__createBinding(exports, vnode_1, "createElementVNode");
var renderer_1 = require("./renderer");
__createBinding(exports, renderer_1, "createRenderer");
var shared_1 = require("@mini-vue/shared");
__createBinding(exports, shared_1, "toDisplayString");
var apiWatch_1 = require("./apiWatch");
__createBinding(exports, apiWatch_1, "watchEffect");
var reactivity_1 = require("@mini-vue/reactivity");
// core
__createBinding(exports, reactivity_1, "reactive");
__createBinding(exports, reactivity_1, "ref");
__createBinding(exports, reactivity_1, "readonly");
// utilities
__createBinding(exports, reactivity_1, "unRef");
__createBinding(exports, reactivity_1, "proxyRefs");
__createBinding(exports, reactivity_1, "isReadonly");
__createBinding(exports, reactivity_1, "isReactive");
__createBinding(exports, reactivity_1, "isProxy");
__createBinding(exports, reactivity_1, "isRef");
// advanced
__createBinding(exports, reactivity_1, "shallowReadonly");
// effect
__createBinding(exports, reactivity_1, "effect");
__createBinding(exports, reactivity_1, "stop");
__createBinding(exports, reactivity_1, "computed");
