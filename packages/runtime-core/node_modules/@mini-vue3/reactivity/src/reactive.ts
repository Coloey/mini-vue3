import { isObject } from "@mini-vue3/shared"
import { readonlyHandlers, shallowReadonlyHanlders } from "./baseHandlers"
import { mutableHandlers } from "./baseHandlers"
export const reactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()
export const shallowReadonlyMap = new WeakMap()
import { ComputedRefImpl } from "./computed"
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
    RAW = '__v_raw'
}
export function reactive(target) {
    return createReactiveObject(target,reactiveMap,mutableHandlers)
}
export function readonly(target) {
    return createReactiveObject(target, readonlyMap,readonlyHandlers)
}
export function isReactive(value: unknown):boolean {
    //如果value是proxy,会触发get操作，而在createGetter里面会判断
    //如果value是普通对象，会返回undefined,需要转换为布尔值
    return !!(value&&value[ReactiveFlags.IS_REACTIVE])
}
export function shallowReadonly(target) {
    return createReactiveObject(
        target,
        shallowReadonlyMap,
        shallowReadonlyHanlders
    );
}
export function isReadonly(value: unknown):boolean {
    return !!(value && value[ReactiveFlags.IS_READONLY])
}
export function isProxy(value:unknown):boolean {
    return isReactive(value) || isReadonly(value)
}
export function toRaw(observed): boolean {
    const raw = observed && observed[ReactiveFlags.RAW]
    //递归
    return raw ? toRaw(raw) : observed
}
export const toReactive = <T extends unknown>(value: T):T =>
    isObject(value) ? reactive(value) :value
export const toReadonly = <T extends unknown>(value: T): T =>
    isObject(value) ? readonly(value as Record<any,any>) : value

function createReactiveObject(target,proxyMap,baseHandlers) {
    //proxy可以监听到用户get或者set动作
    //命中缓存则直接返回
    const existingProxy = proxyMap.get(target)
    if(existingProxy) {
        return existingProxy
    }
    const proxy = new Proxy(target,baseHandlers)
    proxyMap.set(target,proxy)
    return proxy
}