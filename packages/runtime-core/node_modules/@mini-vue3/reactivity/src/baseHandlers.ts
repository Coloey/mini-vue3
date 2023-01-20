import { isObject } from "@mini-vue3/shared"
import { track, trigger } from "./effect"
import { reactive, readonly, ReactiveFlags, reactiveMap, readonlyMap, shallowReadonlyMap } from "./reactive"

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true,true)
function createGetter(isReadonly = false,shallow=false) {
    return function get(target,key,receiver) {
        const isExistInReactiveMap = () => 
            key === ReactiveFlags.RAW && receiver ===reactiveMap.get(target)       
        const isExistInReadonlyMap = () => 
            key === ReactiveFlags.RAW && receiver === readonlyMap.get(target)
        const isExistInShallowReadonlyMap = () =>
            key === ReactiveFlags.RAW && receiver === shallowReadonlyMap.get(target)
        if(key === ReactiveFlags.IS_REACTIVE){
            return !isReadonly
        }else if(key === ReactiveFlags.IS_READONLY){
            return isReadonly
        }else if(
            isExistInReactiveMap() ||
            isExistInReadonlyMap() ||
            isExistInShallowReadonlyMap()
        ){
            return target
        }
        const res=Reflect.get(target,key,receiver)
        if(!isReadonly) {
            //不是readonly需要在触发get的时候依赖收集
            track(target,"get",key)
        }
        if(shallow){
            return res
        }
        // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
        if(isObject(res)){
            return isReadonly ? readonly(res) : reactive(res)
        }
        return res
    }
}
function createSetter() {
    return function set(target,key,value,receiver) {
        const result = Reflect.set(target,key,value,receiver)
        //触发set的时候进行触发依赖
        trigger(target,'set',key)
        return result
    }
}
export const readonlyHandlers = {
    get: readonlyGet,
    set(target,key) {
        console.warn(
            `Set operation on key "${String(key)}" failed: target is readonly.`,
            target
        );
        return true
    }
}
export const mutableHandlers = {
    get,
    set,
}
export const shallowReadonlyHanlders = {
    get: shallowReadonlyGet,
    set(target,key) {
        //readonly 的响应式对象不可以修改值
        console.warn(
               `Set operation on key "${String(key)}" failed: target is readonly`,
               target
        )
        return true
    }
}

