//node序列化
//把对象处理成string
import { NodeType } from "./nodeOps";
export function serialize(node) {
    if(node.type === NodeType.ELEMENT){
        return serializeElement(node)
    }else{
        return serializeText(node)
    }
}
function serializeElement(node){
    // props处理成字符
    // 逻辑：
    // value是null,直接返回``
    // value是``，直接返回key
    // key 和value,返回key=value
    const props = Object.keys(node.props)
    .map((key) => {
        const value = node.props[key]
        return value == null
            ? ``
            : value === ``
                ? key
                : `${key}=${JSON.stringify(value)}`
    })
    .filter(Boolean)
    .join("")
    return `<${node.tag} ${props ? `${props}` : ``}> ${serializeInner(node)}</${node.tag}>`
}
function serializeInner(node){
    return node.children.map((c) => serialize(c)).join(``)
}
function serializeText(node){
    return node.text
}