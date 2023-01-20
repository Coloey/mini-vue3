import { CREATE_ELEMENT_VNODE } from "./runtimeHelpers"
export const enum NodeTypes {
    TEXT,
    ROOT,
    INTERPOLATION,
    SIMPLE_EXPRESSION,
    ELEMENT,
    COMPOUND_EXPRESSION
}
export const enum ElementTypes {
    ELEMENT,
}
export function createSimpleExpression(content) {
    return {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content,
    }
}
export function createInterpolation(content) {
    return {
        type: NodeTypes.INTERPOLATION,
        content: content
    }
}

export function createVNodeCall(context, tag, props?,children?) {
    if(context){
        context.helper(CREATE_ELEMENT_VNODE)
    }
    return {
        //mini-vue暂时没实现block,创建element类型
        type: NodeTypes.ELEMENT,
        tag,
        props,
        children
    }
}