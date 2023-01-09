"use strict";
exports.__esModule = true;
exports.triggerEffects = exports.isTracking = exports.trigger = exports.trackEffects = exports.track = exports.stop = exports.effect = exports.ReactiveEffect = void 0;
var dep_1 = require("./dep");
var shared_1 = require("@mini-vue3/shared");
var activeEffect = void 0;
var shouldTrack = false;
var targetMap = new WeakMap();
//用于依赖收集
var ReactiveEffect = /** @class */ (function () {
    function ReactiveEffect(fn, scheduler) {
        this.fn = fn;
        this.scheduler = scheduler;
        this.active = true;
        this.deps = [];
        console.log("创建ReactiveEffect对象");
    }
    ReactiveEffect.prototype.run = function () {
        console.log("run");
        if (!this.active) {
            return this.fn();
        }
        //执行fn,收集依赖
        shouldTrack = true;
        //执行run，给全局activeEffect赋值
        //利用全局属性获取当前effect
        activeEffect = this;
        //执行用户传入的fn
        console.log("执行用户传入的fn");
        var result = fn();
        //重置
        shouldTrack = false;
        activeEffect = undefined;
        return result;
    };
    ReactiveEffect.prototype.stop = function () {
        if (this.active) {
            //如果是第一次执行stop,进入 并且active重置为false,防止重复调用
            cleanupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
        }
    };
    return ReactiveEffect;
}());
exports.ReactiveEffect = ReactiveEffect;
//避免副作用函数产生遗留
//遍历副作用函数的依赖集合数组
function cleanupEffect(effect) {
    //将该副作用函数从相关的依赖集合中移除
    effect.deps.forEach(function (dep) {
        dep["delete"](effect);
    });
    effect.deps.length = 0;
}
function effect(fn, options) {
    if (options === void 0) { options = {}; }
    var _effect = new ReactiveEffect(fn);
    //extend就是object.assign,把用户传过来的值合并到_effect对象
    shared_1.extend(_effect, options);
    if (!options || !options.lazy) {
        _effect.run();
    }
    //不是懒执行则立刻返回
    var runner;
}
exports.effect = effect;
function stop(runner) {
    runner.effect.stop();
}
exports.stop = stop;
function track(target, type, key) {
    if (!isTracking()) {
        return;
    }
    console.log("\u89E6\u53D1track -> target: " + target + " type: " + type + " key:" + key);
    var depsMap = targetMap.get(target);
    if (!depsMap) {
        //初始化depsMap的
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    var dep = depsMap.get(key);
    if (!dep) {
        dep = dep_1.createDep();
        depsMap.set(key.dep);
    }
    trackEffects(dep);
}
exports.track = track;
function trackEffects(dep) {
    //如果依赖已经收集就不需要再收集一次，否则每次都需要cleanupEffect
    //将依赖收集到deps数组，方便在cleanupEffect里面清除
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect)(activeEffect).deps.push(dep);
    }
}
exports.trackEffects = trackEffects;
function trigger(target, type, key) {
    //先收集所有dep放到deps里面,避免无限循环
    //在trigger内部遍历dep集合执行，会调用cleanupEffect进行清除一边清除一边执行会导致无限循环
    //拷贝副作用到一个新的集合，执行拷贝后的依赖
    var deps = [];
    var depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    var dep = depsMap.get(key);
    deps.push(dep);
    var effects = [];
    deps.forEach(function (dep) {
        //解构dep得到dep内部存储的effect
        effects.push.apply(effects, dep);
    });
    //将effects放到set进行去重
    triggerEffects(dep_1.createDep(effects));
}
exports.trigger = trigger;
function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}
exports.isTracking = isTracking;
function triggerEffects(dep) {
    //执行收集到的所有effect的run方法
    for (var _i = 0, dep_2 = dep; _i < dep_2.length; _i++) {
        var effect_1 = dep_2[_i];
        if (effect_1.scheduler) {
            //scheduler可以让用户自己选择调用的时机
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}
exports.triggerEffects = triggerEffects;
