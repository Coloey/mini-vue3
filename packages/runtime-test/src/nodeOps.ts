export const enum NodeType {
    ELEMENT = 'element',
    TEXT = 'TEXT'
}
let nodeId = 0
//这个函数会在runtime-core初始化element时调用
function createElement(tag: string) {   
    const node = {
        tag,
        id: nodeId++,
        type: NodeType.ELEMENT,
        props: {},
        children: [],
        parentNode: null
    }
    return node
}
function insert(child,parent) {
    parent.children.push(child)
    child.parentNode=parent
}
function parentNode(node) {
    return node.parentNode
}
function setElementText(el,text) {
    el.children = [
        {
            id: nodeId++,
            type: NodeType.TEXT,
            text,
            parentNode: el
        }
    ]
}
export const nodeOps = { createElement,insert,parentNode,setElementText}