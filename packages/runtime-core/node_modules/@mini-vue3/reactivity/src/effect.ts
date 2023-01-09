import { createDep } from "./dep";
import {extend} from "@mini-vue3/shared"
let activeEffect = void 0
let shouldTrack = false
const targetMap = new WeakMap()
//用于依赖收集
export class ReactiveEffect {
    active = true
    deps = []
    public onStop?: () => void
    constructor(public fn,public scheduler?) {
        console.log("创建ReactiveEffect对象")
    }
    run(){
        console.log("run")
        if(!this.active){
            return this.fn()
        }
        //执行fn,收集依赖
        shouldTrack = true
        //执行run，给全局activeEffect赋值
        //利用全局属性获取当前effect
        activeEffect = this as any 
        //执行用户传入的fn
        console.log("执行用户传入的fn")
        const result = fn()
        //重置
        shouldTrack = false
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
function cleanupEffect(effect) {
    //将该副作用函数从相关的依赖集合中移除
    effect.deps.forEach((dep) => {
        dep.delete(effect)
    })
    effect.deps.length=0
}
export function effect(fn,options={}) {
    const _effect = new ReactiveEffect(fn)
    //extend就是object.assign,把用户传过来的值合并到_effect对象
    extend(_effect,options)
    if(!options || !options.lazy){
        _effect.run()
    }
    //不是懒执行则立刻返回
    const runner: any
}
export function stop(runner) {
    runner.effect.stop()
}
export function track(target,type,key) {
    if(!isTracking()){
        return
    }
    console.log(`触发track -> target: ${target} type: ${type} key:${key}`)
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        //初始化depsMap的
        depsMap = new Map()
        targetMap.set(target,depsMap)
    }
    let dep = depsMap.get(key)
    if(!dep){
        dep=createDep()
        depsMap.set(key.dep)
    }
    trackEffects(dep)
}
export function trackEffects(dep){
    //如果依赖已经收集就不需要再收集一次，否则每次都需要cleanupEffect
    //将依赖收集到deps数组，方便在cleanupEffect里面清除
    if(!dep.has(activeEffect)){
        dep.add(activeEffect)
        (activeEffect as any).deps.push(dep)
    }
}
export function trigger(target,type,key) {
    //先收集所有dep放到deps里面,避免无限循环
    //在trigger内部遍历dep集合执行，会调用cleanupEffect进行清除一边清除一边执行会导致无限循环
    //拷贝副作用到一个新的集合，执行拷贝后的依赖
    let deps:Array<any> = []
    const depsMap = targetMap.get(target)
    if(!depsMap)return
  
    const dep = depsMap.get(key)

    deps.push(dep)
    const effects: ReactiveEffect[] = []
    deps.forEach((dep)=>{
        //解构dep得到dep内部存储的effect
        effects.push(...dep)
    })
    //将effects放到set进行去重
    triggerEffects(createDep(effects))

}
export function isTracking(){
    return shouldTrack && activeEffect !== undefined
}
export function triggerEffects(dep){
    //执行收集到的所有effect的run方法
    for(const effect of dep) {
        if(effect.scheduler){
            //scheduler可以让用户自己选择调用的时机
            effect.scheduler()
        }else{
            effect.run()
        }
    }
}
