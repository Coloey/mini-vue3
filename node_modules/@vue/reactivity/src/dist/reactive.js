"use strict";
exports.__esModule = true;
exports.toReadonly = exports.toReactive = exports.toRaw = exports.isProxy = exports.isReadonly = exports.isReactive = exports.reactive = exports.shallowReadonlyMap = exports.readonlyMap = exports.reactiveMap = void 0;
var shared_1 = require("@mini-vue3/shared");
exports.reactiveMap = new WeakMap();
exports.readonlyMap = new WeakMap();
exports.shallowReadonlyMap = new WeakMap();
function reactive(target) {
    return createReactiveObject(target, exports.reactiveMap, mutableHandlers);
}
exports.reactive = reactive;
function isReactive(value) {
    //如果value是proxy,会触发get操作，而在createGetter里面会判断
    //如果value是普通对象，会返回undefined,需要转换为布尔值
    return !!(value && value["__v_isReactive" /* IS_REACTIVE */]);
}
exports.isReactive = isReactive;
function isReadonly(value) {
    return !!(value && value["__v_isReadonly" /* IS_READONLY */]);
}
exports.isReadonly = isReadonly;
function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}
exports.isProxy = isProxy;
function toRaw(observed) {
    var raw = observed && observed["__v_raw" /* RAW */];
    //递归
    return raw ? toRaw(raw) : observed;
}
exports.toRaw = toRaw;
exports.toReactive = function (value) {
    return shared_1.isObject(value) ? reactive(value) : value;
};
exports.toReadonly = function (value) {
    return shared_1.isObject(value) ? readonly(value) : value;
};
