import {emit} from "./componentEmits"
import { initProps } from "./componentProps"
import { initSlots } from "./componentSlots"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
export function createComponentInstance(vnode,parent) {
    const instance = {
        type: vnode.type,
        vnode,
        next: null,//需要更新的vnode,用于更新component类型的组件
        props: {},
        parent,
        provides: parent ? parent.provides : {},//获取parent的provides作为当前组件初始化值，这样就可以继承parent.provides的属性
        proxy: null,
        isMounted: false,
        attrs: {},//存放attrs的数据
        ctx: {},
        setupState:{}//存储setup的返回值
        emit: () => {}
    }
    //prod环境下的ctx是下面简单的结构
    instance.ctx = {
        _: instance
    }
    //这里先用bind把instance进行绑定
    //后面用户使用的时候只需要给event和参数即可
    instance.emit = emit.bind(null,instance) as any
    return instance
}
export function setupComponent(instance) {
    //处理props,取出vnode里的props
    const {props,children} = instance.vnode
    initProps(instance,props)
    //处理slots
    initSlots(instance,children)
    /*源码里有两种类型的component,一种基于options创建，一种基于function创建，叫做stateful*/
    setupStatefulComponent(instance)
}
function setupStatefulComponent(instance) {
    //创建代理，proxy对象代理instance.ctx对象
    instance.proxy = new Proxy(instance.ctx,PublicInstanceProxyHandlers)
    //用户声明的对象就是instance.type
    //const Component = {setup(),render()...}
    const Component = instance.type
    //调用setup
    const {setup} = Component
    if(setup){
        //在调用setup之前设置当前currentInstance
        setCurrentInstance(instance)
        const setupContext=createSetupContext(instance)
        //只有在dev环境下才把props设置为只读
        const setupResult = 
        setup && setup(shallowReadonly(instance.props),setupContext)
        setCurrentInstance(null)
        //处理setupResult
        handleSetupResult(instance,setupResult)
    }else{
        finishComponentSetup(instance)
    }
} 
function handleSetupResult(instance,setupResult) {
    if(typeof setupResult === 'function') {
        //如果返回function,绑定到render上，认为是render逻辑
        //setup(){return ()=>h('div')}
        instance.render=setupResult
    }else if(typeof setupResult === "object"){
        //为了方便用户直接访问ref类型的值，需要proxyRefs把setupResult对象作一层代理
        //直接使用值而不用.value
        instance.setupState = proxyRefs(setupResult)
    }
    finishComponentSetup(instance)
}
function finishComponentSetup(instance) {
    //给instance设置render
    //先取到用户设置的component options
    const Component = instance.type
    if(!instance.render){
        //如果compile有值，并且组件没有render函数，就需要把template编译成render
        if(compile && !Component.render) {
            if(Component.template) {
                //这里就是runtime模块和compile模块结合点
                const template = Component.template
                Component.render=compile(template)
            }
        }
        instance.render = Component.render
    }
}
function createSetupContext(instance) {
    console.log("初始化setup context")
    return {
        attrs: instance.attrs,
        slots:instance.slots,
        emit: instance.emit,
        expose: () => {}
    }
}
let currentInstance = {}
export function getCurrentInstance(instance) {
    return currentInstance
}
export function setCurrentInstance(instance) {
    currentInstance = instance
}
let compile 
export function registerRuntimeCompiler(_compile) {
    compile = _compile;
}