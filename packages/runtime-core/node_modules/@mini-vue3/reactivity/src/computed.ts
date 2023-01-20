import { createDep,Dep } from "./dep";
import { ReactiveEffect } from "./effect";
import { trackRefValue, triggerRefValue } from "./ref";

export class ComputedRefImpl<T> {
    public dep: Dep;
    public effect: ReactiveEffect;
    private _dirty: boolean;
    private _value!: T;
    constructor(getter) {
        this._dirty=true
        this.dep = createDep()
        this.effect = new ReactiveEffect(getter,() => {
            //当计算属性依赖的响应式数据发生变化 手动调用trigger触发响应
            if(!this._dirty){
                this._dirty=true
                triggerRefValue(this)
            }
        })
        this.effect.computed = this
    }
    get value() {
        //收集依赖
        trackRefValue(this)
        if(this._dirty) {
            this._dirty = false
            this._value = this.effect.run()!
        }
        return this._value
    }
}
export function computed(getter) {
    return new ComputedRefImpl(getter)
}