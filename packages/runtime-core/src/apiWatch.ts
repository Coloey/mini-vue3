import { effect, ReactiveEffect } from "@mini-vue3/reactivity"
import { queuePreFlushCb } from "./scheduler"

//Simple effect
export function watchEffect(effect) {
    doWatch(effect)
}
function doWatch(source){
    const job = () => {
        effect.run()
    }
    //当触发trigger的时候调用scheduler
    //可以在render前执行回调，回调变成一个异步行为
    const scheduler = () => queuePreFlushCb(job)
    //在执行effct.run时会调用getter
    const getter = () => {
        source()
    }
    const effect = new ReactiveEffect(getter,scheduler)
    //这里执行的是getter
    effect.run()
}