import { ShapeFlags } from "@mini-vue3/shared";
export {createVNode as createElementVNode}

export const createVNode = function(
    type: any,
    props?: any,
    children?: string | Array<any>
) {
    //type为string:createVNode("div")
    //type 为组件对象:createVNode(App)
    const vnode = {
        el: null,
        component: null,
        key: props?.key,
        type,
        props: props || {},
        children,
        shapeFlag: getShapeFlag(type)
    }
    //基于children再设置shapeFlag
    if(Array.isArray(children)){
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }else if(typeof children === "string") {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    }
    normalizeChildren(vnode,children)
    return vnode
}
export function normalizeChildren(vnode,children) {
    if(typeof children === 'object'){
         //暂时表示出slots_children类型，暂时只有element和component类型组件
        if(vnode.shapeFlag & ShapeFlags.ELEMENT){
            //这里是element
        }else{
            //这里是slots
            vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
        }
    } 
}
export const Text = Symbol("Text")
export const Fragment =Symbol("Fragment")
export function createTextVNode(text: string='') {
    return createTextVNode(Text,{},text)
}
//标准化vnode的格式
export function normalizeVNode(child) {
    //暂时只支持处理child为string 和number的情况
    if(typeof child === 'string' || typeof child === 'number') {
        return createTextVNode(Text,null,String(child))
    }else{
        return child
    }
}
function getShapeFlag(type: any) {
    return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}