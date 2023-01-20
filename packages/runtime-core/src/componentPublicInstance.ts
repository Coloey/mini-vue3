import {hasOwn} from "@mini-vue3/shared"
//instance的代理对象，渲染上下文对象用在拦截数据状态的读取和设置操作，
//每当在渲染函数或者生命周期钩子中通过this读取数据时，都会优先从组件的
//的自身状态中读取，如果，组件自身没有对应的值，则从props中读取，最后
//我们将渲染上下文作为渲染函数以及生命周期钩子的this值即可
const publicPropertiesMap = {
    //当用户调用instance.proxy.$emit会触发这个函数
    //i就是instance缩写，也就是组件实例对象
    $el: (i) => i.vnode.el,
    $emit: (i) => i.emit,
    $slots: (i) => i.slots,
    $props: (i) => i.props
}
export const PublicInstanceProxyHandlers = {
    get({_:instance},key) {
        const {setupState,props} = instance
        console.log(`触发proxy hook,key -> :${key}`)
        if(key[0] !== '$') {
            //说明不是访问public api
            //先检测访问的key是否存在于setupState中，是就直接返回
            if(hasOwn(setupState,key)){
                return setupState[key]
            }else if(hasOwn(props,key)){
                return props[key]
            }
        }
        const publicGetter = publicPropertiesMap[key]
        if(publicGetter){
            return publicGetter(instance)
        }
    },
    set({_:instance},key,value) {
        const {setupState} = instance
        if(hasOwn(setupState,key)){
            //有的话就是直接赋值
            setupState[key] = value
        } else {
            console.error("不存在")
        }
        return true
    }
}