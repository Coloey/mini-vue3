"use strict";
exports.__esModule = true;
exports.hyphenate = exports.toHandlerKey = exports.isOn = exports.capitalize = exports.hasOwn = exports.camelize = exports.hasChanged = exports.extend = exports.isArray = exports.isNumber = exports.isString = exports.isFunction = exports.isObject = void 0;
exports.isObject = function (value) {
    return typeof value === 'object' && value !== null;
};
/**
 * 判断函数
 */
exports.isFunction = function (value) {
    return typeof value === 'function';
};
/**
 * 判断字符串
 */
exports.isString = function (value) {
    return typeof value === 'string';
};
/**
 * 判断数字
 */
exports.isNumber = function (value) {
    return typeof value === 'number';
};
/**
 * 判断数组
 */
exports.isArray = Array.isArray;
exports.extend = Object.assign;
function hasChanged(value, oldValue) {
    return !Object.is(value, oldValue);
}
exports.hasChanged = hasChanged;
//转为驼峰
var camelizeRE = /(-)(\w)/g;
exports.camelize = function (str) {
    return str.replace(camelizeRE, function (_, c) { return (c ? c.toUpperCase() : ""); });
};
function hasOwn(val, key) {
    return Object.prototype.hasOwnProperty.call(val, key);
}
exports.hasOwn = hasOwn;
//首字母大写
exports.capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
function isOn() { }
exports.isOn = isOn;
(function (key) { return /^on[A-Z]/.test(key); });
//添加on前缀，并且首字母大写
exports.toHandlerKey = function (key) {
    return str ? "on" + exports.capitalize(str) : "";
};
//用来匹配kebab-case的情况
/*比如onTest-event 可以匹配到T,取到T在前面加一个 - \B可以匹配到大写字母
前面那个位置，加一个- */
var hyphenateRE = /\B([A-Z])/g;
//驼峰转烤肉串
exports.hyphenate = function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase();
};
