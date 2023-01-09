"use strict";
exports.__esModule = true;
exports.registerRuntimeCompiler = exports.setCurrentInstance = exports.getCurrentInstance = exports.setupComponent = exports.createComponentInstance = void 0;
var componentEmits_1 = require("./componentEmits");
var componentProps_1 = require("./componentProps");
var componentSlots_1 = require("./componentSlots");
var componentPublicInstance_1 = require("./componentPublicInstance");
function createComponentInstance(vnode, parent) {
    var instance = {
        type: vnode.type,
        vnode: vnode,
        next: null,
        props: {},
        parent: parent,
        provides: parent ? parent.provides : {},
        proxy: null,
        isMounted: false,
        attrs: {},
        ctx: {},
        setupState: {} //存储setup的返回值
        ,
        emit: function () { }
    };
    //prod环境下的ctx是下面简单的结构
    instance.ctx = {
        _: instance
    };
    //这里先用bind把instance进行绑定
    //后面用户使用的时候只需要给event和参数即可
    instance.emit = componentEmits_1.emit.bind(null, instance);
    return instance;
}
exports.createComponentInstance = createComponentInstance;
function setupComponent(instance) {
    //处理props,取出vnode里的props
    var _a = instance.vnode, props = _a.props, children = _a.children;
    componentProps_1.initProps(instance, props);
    //处理slots
    componentSlots_1.initSlots(instance, children);
    /*源码里有两种类型的component,一种基于options创建，一种基于function创建，叫做stateful*/
    setupStatefulComponent(instance);
}
exports.setupComponent = setupComponent;
function setupStatefulComponent(instance) {
    //创建代理，proxy对象代理instance.ctx对象
    instance.proxy = new Proxy(instance.ctx, componentPublicInstance_1.PublicInstanceProxyHandlers);
    //用户声明的对象就是instance.type
    //const Component = {setup(),render()...}
    var Component = instance.type;
    //调用setup
    var setup = Component.setup;
    if (setup) {
        //在调用setup之前设置当前currentInstance
        setCurrentInstance(instance);
        var setupContext = createSetupContext(instance);
        //只有在dev环境下才把props设置为只读
        var setupResult = setup && setup(shallowReadonly(instance.props), setupContext);
        setCurrentInstance(null);
        //处理setupResult
        handleSetupResult(instance, setupResult);
    }
    else {
        finishComponentSetup(instance);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'function') {
        //如果返回function,绑定到render上，认为是render逻辑
        //setup(){return ()=>h('div')}
        instance.render = setupResult;
    }
    else if (typeof setupResult === "object") {
        //为了方便用户直接访问ref类型的值，需要proxyRefs把setupResult对象作一层代理
        //直接使用值而不用.value
        instance.setupState = proxyRefs(setupResult);
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    //给instance设置render
    //先取到用户设置的component options
    var Component = instance.type;
    if (!instance.render) {
        //如果compile有值，并且组件没有render函数，就需要把template编译成render
        if (compile && !Component.render) {
            if (Component.template) {
                //这里就是runtime模块和compile模块结合点
                var template = Component.template;
                Component.render = compile(template);
            }
        }
        instance.render = Component.render;
    }
}
function createSetupContext(instance) {
    console.log("初始化setup context");
    return {
        attrs: instance.attrs,
        slots: instance.slots,
        emit: instance.emit,
        expose: function () { }
    };
}
var currentInstance = {};
function getCurrentInstance(instance) {
    return currentInstance;
}
exports.getCurrentInstance = getCurrentInstance;
function setCurrentInstance(instance) {
    currentInstance = instance;
}
exports.setCurrentInstance = setCurrentInstance;
var compile;
function registerRuntimeCompiler(_compile) {
    compile = _compile;
}
exports.registerRuntimeCompiler = registerRuntimeCompiler;
