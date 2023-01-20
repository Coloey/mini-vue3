import { getCurrentInstance } from "./component";

export function provide(key, value) {
    const currentInstance = getCurrentInstance()
    if(currentInstance) {
        let { provides } = currentInstance
        const parentProvides = currentInstance.parent?.provides
        //当父级 key 和 爷爷级别的 key 重复的时候，对于子组件来讲，需要取最近的父级别组件的值
        // 那这里的解决方案就是利用原型链来解决
        // provides 初始化的时候是在 createComponent 时处理的，当时是直接把 parent.provides 赋值给组件的 provides 的
        //如果provides和parentProvides相等 说明是第一次做provide
        //我们就可以把 parent.provides 作为 currentInstance.provides 的原型重新赋值
        if (parentProvides === provides) {
            provides = currentInstance.provides = Object.create(parentProvides)
        }
        provides[key] = value
    }
}

export function inject(key, defaultValue) {
    const currentInstance = getCurrentInstance()
    if(currentInstance) {
        const provides = currentInstance.parent?.provides
        if(key in provides) {
            return provides[key]
        }else if(defaultValue) {
            if(typeof defaultValue === 'function') {
                return defaultValue()
            }
            return defaultValue
        }
    }
}