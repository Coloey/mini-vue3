import { ShapeFlags } from "@mini-vue3/shared";
export function initSlots(instance,children) {
    const {vnode} = instance
    console.log("初始化slots")
    if(vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
        normalizeObjectSlots(children,(instace.slots = {}))
    }
}
const normalizeSlotValue = (value) => {
    //把function返回的值转换为array,这样slot可以支持多个元素
    return Array.isArray(value) ? value : [value]
}
const normalizeObjectSlots = (rawSlots,slots) => {
    for(const key in rawSlots) {
        const value = rawSlots[key]
        if(typeof value === 'function') {
            //把函数给到slots对象存起来，后续在renderSlots中调用
            //这里默认slots返回的就是一个vnode对象
            slots[key]= (props)=> normalizeSlotValue(value(props))
        }
    }
}