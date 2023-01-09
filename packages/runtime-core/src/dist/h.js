"use strict";
exports.__esModule = true;
exports.h = void 0;
var vnode_1 = require("./vnode");
exports.h = function (type, props, children) {
    if (props === void 0) { props = null; }
    if (children === void 0) { children = []; }
    return vnode_1.createVNode(type, props, children);
};
