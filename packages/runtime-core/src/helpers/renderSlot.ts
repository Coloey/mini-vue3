import { createVNode, Fragment } from "../vnode"

/*Compiler runtime helper for rendering '<slot/>'
用来render slot ,这里是取数据然后渲染出来，这里的目的是
render函数中调用renderSlot去instance.slots内的数据
*/
export function renderSlot(slots, name: string, props = {}) {
    const slot = slots[name]
    console.log(`渲染插槽 -> ${name}`)
    if(slot) {
        const slotContent = slot(props)
        return createVNode(Fragment, {}, slotContent)
    }
}