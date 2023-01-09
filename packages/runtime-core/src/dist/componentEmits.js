"use strict";
exports.__esModule = true;
exports.emit = void 0;
var shared_1 = require("@mini-vue3/shared");
function emit(instance, event) {
    var rawArgs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        rawArgs[_i - 2] = arguments[_i];
    }
    //emit是基于props里面的onXXX的函数进行匹配
    //先从props中看看是否有对应的event handler
    var props = instance.props;
    //烤肉串名需要转换为驼峰名
    var handler = props[shared_1.toHandlerKey(shared_1.camelize(event))];
    //如果上面没有匹配，那么检测一下event是否是kebab-case类型
    if (!handler) {
        handler = props[(shared_1.toHandlerKey(shared_1.hyphenate(event)))];
    }
    if (handler) {
        handler.apply(void 0, rawArgs);
    }
}
exports.emit = emit;
