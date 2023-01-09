"use strict";
exports.__esModule = true;
exports.normalizeVNode = exports.createTextVNode = exports.Fragment = exports.Text = exports.normalizeChildren = exports.createVNode = exports.createElementVNode = void 0;
var shared_1 = require("@mini-vue3/shared");
exports.createVNode = function (type, props, children) {
    //type为string:createVNode("div")
    //type 为组件对象:createVNode(App)
    var vnode = {
        el: null,
        component: null,
        key: props === null || props === void 0 ? void 0 : props.key,
        type: type,
        props: props || {},
        children: children,
        shapeFlag: getShapeFlag(type)
    };
    //基于children再设置shapeFlag
    if (Array.isArray(children)) {
        vnode.shapeFlag |= shared_1.ShapeFlags.ARRAY_CHILDREN;
    }
    else if (typeof children === "string") {
        vnode.shapeFlag |= shared_1.ShapeFlags.TEXT_CHILDREN;
    }
    normalizeChildren(vnode, children);
    return vnode;
};
exports.createElementVNode = exports.createVNode;
function normalizeChildren(vnode, children) {
    if (typeof children === 'object') {
        //暂时表示出slots_children类型，暂时只有element和component类型组件
        if (vnode.shapeFlag & shared_1.ShapeFlags.ELEMENT) {
            //这里是element
        }
        else {
            //这里是slots
            vnode.shapeFlag |= shared_1.ShapeFlags.SLOTS_CHILDREN;
        }
    }
}
exports.normalizeChildren = normalizeChildren;
exports.Text = Symbol("Text");
exports.Fragment = Symbol("Fragment");
function createTextVNode(text) {
    if (text === void 0) { text = ''; }
    return createTextVNode(exports.Text, {}, text);
}
exports.createTextVNode = createTextVNode;
//标准化vnode的格式
function normalizeVNode(child) {
    //暂时只支持处理child为string 和number的情况
    if (typeof child === 'string' || typeof child === 'number') {
        return createTextVNode(exports.Text, null, String(child));
    }
    else {
        return child;
    }
}
exports.normalizeVNode = normalizeVNode;
function getShapeFlag(type) {
    return typeof type === "string"
        ? shared_1.ShapeFlags.ELEMENT
        : shared_1.ShapeFlags.STATEFUL_COMPONENT;
}
