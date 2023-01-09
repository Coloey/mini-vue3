"use strict";
exports.__esModule = true;
exports.computed = exports.ComputedRefImpl = void 0;
var dep_1 = require("./dep");
var effect_1 = require("./effect");
var ref_1 = require("./ref");
var ComputedRefImpl = /** @class */ (function () {
    function ComputedRefImpl(getter) {
        var _this = this;
        this._dirty = true;
        this.dep = dep_1.createDep();
        this.effect = new effect_1.ReactiveEffect(getter, function () {
            //当计算属性依赖的响应式数据发生变化 手动调用trigger触发响应
            if (!_this._dirty) {
                _this._dirty = true;
                ref_1.triggerRefValue(_this);
            }
        });
    }
    Object.defineProperty(ComputedRefImpl.prototype, "value", {
        get: function () {
            //收集依赖
            ref_1.trackRefValue(this);
            if (this._dirty) {
                this._dirty = false;
                this._value = this.effect.run();
            }
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    return ComputedRefImpl;
}());
exports.ComputedRefImpl = ComputedRefImpl;
function computed(getter) {
    return new ComputedRefImpl(getter);
}
exports.computed = computed;
