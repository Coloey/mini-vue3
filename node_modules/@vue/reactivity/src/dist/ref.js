"use strict";
exports.__esModule = true;
exports.isRef = exports.unRef = exports.proxyRefs = exports.trackRefValue = exports.triggerRefValue = exports.ref = exports.RefImpl = void 0;
var shared_1 = require("@mini-vue3/shared");
var effect_1 = require("./effect");
var reactive_1 = require("./reactive");
var RefImpl = /** @class */ (function () {
    function RefImpl(value) {
        this.__v_isRef = true;
        this._rawValue = value;
        //value是一个对象的话用reactive包裹
        this._value = convert(value);
        this.dep = createDep();
    }
    Object.defineProperty(RefImpl.prototype, "value", {
        get: function () {
            //收集依赖
            trackRefValue(this);
            return this._value;
        },
        set: function (newValue) {
            //当新值不等于老值才需要触发依赖
            if (shared_1.hasChanged(newValue, this._rawValue)) {
                this._value = newValue;
                this._rawValue = newValue;
                //触发依赖
                triggerRefValue(this);
            }
        },
        enumerable: false,
        configurable: true
    });
    return RefImpl;
}());
exports.RefImpl = RefImpl;
function convert(value) {
    return shared_1.isObject(value) ? reactive_1.reactive(value) : value;
}
function ref(value) {
    return createRef(value);
}
exports.ref = ref;
function createRef(value) {
    var refImpl = new RefImpl(value);
    return refImpl;
}
function triggerRefValue(ref) {
    effect_1.triggerEffects(ref.dep);
}
exports.triggerRefValue = triggerRefValue;
function trackRefValue(ref) {
    if (effect_1.isTracking()) {
        effect_1.trackEffects(ref.dep);
    }
}
exports.trackRefValue = trackRefValue;
//解构ref,在template中使用ref,可以直接使用，不用.value
var shallowUnwrapHandlers = {
    get: function (target, key, receiver) {
        return unRef(Reflect.get(target, key, receiver));
    },
    set: function (target, key, value, receiver) {
        var oldValue = target[key];
        if (isRef(oldValue) && !isRef(value)) {
            return (target[key].value = value);
        }
        else {
            return Reflect.set(target, key, receiver);
        }
    }
};
function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs);
}
exports.proxyRefs = proxyRefs;
//拿到ref里面的值
function unRef(ref) {
    return isRef(ref) ? ref.value : ref;
}
exports.unRef = unRef;
function isRef(value) {
    return !!value.__v_isRef;
}
exports.isRef = isRef;
