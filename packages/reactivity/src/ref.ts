import { hasChanged, isObject } from "@mini-vue3/shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
import { createDep } from "./dep";
export class RefImpl {
    private _rawValue: any;
    private _value: any;
    public dep;
    public __v_isRef = true;
    constructor(value) {
        this._rawValue = value
        //value是一个对象的话用reactive包裹
        this._value = convert(value)
        this.dep = createDep()
    }
    get value(){
        //收集依赖
        trackRefValue(this)
        return this._value
    }
    set value(newValue) {
        //当新值不等于老值才需要触发依赖
        if(hasChanged(newValue,this._rawValue)){
            this._value = newValue
            this._rawValue = newValue
            //触发依赖
            triggerRefValue(this)
        }
    }
}
function convert(value) {
    return isObject(value) ? reactive(value) : value
}
export function ref(value) {
    return createRef(value)
}
function createRef(value) {
    const refImpl = new RefImpl(value)
    return refImpl
}
export function triggerRefValue(ref) {
    triggerEffects(ref.dep)
}
export function trackRefValue(ref) {
    if(isTracking()) {
        trackEffects(ref.dep)
    }
}
//解构ref,在template中使用ref,可以直接使用，不用.value
const shallowUnwrapHandlers = {
    get(target,key,receiver) {
        return unRef(Reflect.get(target,key,receiver))
    },
    set(target,key,value,receiver) {
        const oldValue = target[key]
        if(isRef(oldValue) && !isRef(value)){
            return (target[key].value=value)
        }else{
            return Reflect.set(target,key,receiver)
        }
    }
}
export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs,shallowUnwrapHandlers)
}
//拿到ref里面的值
export function unRef(ref) {
    return isRef(ref) ? ref.value : ref
}
export function isRef(value) {
    return !!value.__v_isRef;
}