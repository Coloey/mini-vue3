import { createDep, Dep } from "./dep";
import {extend, isArray} from "@mini-vue3/shared"
import { ComputedRefImpl } from "./computed"
let activeEffect :ReactiveEffect | undefined
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()
export type EffectScheduler = (...args: any[]) => any
export interface ReactiveEffectOptions {
    lazy?: boolean,
    scheduler?: EffectScheduler,
    onStop?: () => void
}
export interface ReactiveEffectRunner<T = any> {
    (): T,
    effect: ReactiveEffect
}
//用于依赖收集
export class ReactiveEffect <T = any>{
    active = true
    deps: Dep[] = []
    public onStop?: () => void
    computed?: ComputedRefImpl<T>
    constructor(public fn,public scheduler?) {
        console.log("创建ReactiveEffect对象")
    }
    run(){
        console.log("run")
        if(!this.active){
            return this.fn()
        }
        let lastShouldTrack = shouldTrack
        //执行fn,收集依赖
        shouldTrack = true
        //执行run，给全局activeEffect赋值
        //利用全局属性获取当前effect
        activeEffect = this as ReactiveEffect | undefined
        //执行用户传入的fn
        console.log("执行用户传入的fn")
        const result = this.fn()
        //重置
        shouldTrack = lastShouldTrack
        activeEffect = undefined
        return result
    }
    stop() {
        if(this.active){
            //如果是第一次执行stop,进入 并且active重置为false,防止重复调用
            cleanupEffect(this)
            if(this.onStop){
                this.onStop()
            }
            this.active=false
        }
    }
}
//避免副作用函数产生遗留
//遍历副作用函数的依赖集合数组
function cleanupEffect(effect: ReactiveEffect) {
    const { deps } = effect
    //将该副作用函数从相关的依赖集合中移除
    if(deps.length) {
        for( let i = 0; i < deps.length; i++) {
            deps[i].delete(effect)
        }
    }
    deps.length=0
}
export function effect<T = any>(
    fn: () => T,
    options?: ReactiveEffectOptions): ReactiveEffectRunner {
    if((fn as ReactiveEffectRunner).effect) {
        fn = (fn as ReactiveEffectRunner).effect.fn
    }
    const _effect = new ReactiveEffect(fn)
    //extend就是object.assign,把用户传过来的值合并到_effect对象
    extend(_effect,options)
    if(!options || !options.lazy){
        _effect.run()
    }
    //把_effect.run方法返回 用户可以自行选择调用的时机
    const runner: any = _effect.run.bind(_effect) as ReactiveEffectRunner;
    runner.effect =_effect
    return runner
}
export function stop(runner: ReactiveEffectRunner) {
    runner.effect.stop()
}
export let shouldTrack = true
const trackStack: boolean[] = []
export function pauseTracking() {
    trackStack.push(shouldTrack)
    shouldTrack = false
}
export function enblaTracking() {
    trackStack.push(shouldTrack)
    shouldTrack = true
}
export function resetTracking() {
    const last = trackStack.pop()
    shouldTrack = true
}
export function track(target: object,type,key) {
    if(!isTracking()){
        return
    }
    console.log(`触发track -> target: ${target} type: ${type} key:${key}`)
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        //初始化depsMap的
        targetMap.set(target,(depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if(!dep){
        depsMap.set(key,( dep = createDep()))
    }
    trackEffects(dep)
}
export function trackEffects(dep: Dep){
    let shouldTrack = false
    shouldTrack = !dep.has(activeEffect!)
    //如果依赖已经收集就不需要再收集一次，否则每次都需要cleanupEffect
    //将依赖收集到deps数组，方便在cleanupEffect里面清除
    if(shouldTrack){
        dep.add(activeEffect!)
        activeEffect!.deps.push(dep)
    }
}
export function trigger(target: object, type, key?: unknown) {
    //先收集所有dep放到deps里面,避免无限循环
    //在trigger内部遍历dep集合执行，会调用cleanupEffect进行清除一边清除一边执行会导致无限循环
    //拷贝副作用到一个新的集合，执行拷贝后的依赖
    let deps: (Dep | undefined)[] = []
    const depsMap = targetMap.get(target)
    if(!depsMap) {
        return
    }
    let dep = depsMap.get(key)

    deps.push(dep)
    const effects: ReactiveEffect[] = []
    deps.forEach((dep)=>{
        //解构dep得到dep内部存储的effect
        if(dep) {
            effects.push(...dep)
        }
    })
    //将effects放到set进行去重
    triggerEffects(createDep(effects))

}
export function isTracking(){
    return shouldTrack && activeEffect !== undefined
}
export function triggerEffects(dep: Dep | ReactiveEffect[]) {
    const effects = isArray(dep) ? dep : [...dep]
    //执行收集到的所有effect的run方法
    for(const effect of effects) {
        if(effect.computed) {
            triggerEffect(effect)
        }
    }
    for(const effect of effects) {
        if(!effect.computed) {
            triggerEffect(effect)
        }
    }

}
function triggerEffect(
    effect: ReactiveEffect
) {
    if(effect !==  activeEffect) {
        if(effect?.scheduler){
            //scheduler可以让用户自己选择调用的时机
            effect.scheduler()
        }else{
            effect?.run()
        }
    }
}
