import { NodeTypes } from "./ast"
import { TO_DISPLAY_STRING } from "./runtimeHelpers"

export function transform(root, options = {}) {
    //创建context
    const context = createTransformContext(root, options)
    //遍历node
    traverseNode(root, context)

    createRootCodegen(root, context)
    //用于后续代码拼接
    root.helpers.push(...context.helpers.keys())
}
function traverseNode(node: any, context) {
    //拿到需要转换的结点
    const type: NodeTypes = node.type
    //遍历调用所有nodeTransforms
    //把node给到transform
    //用户可以对node做处理
    const nodeTransforms = context.nodeTransforms
    const exitFns: any = []
    for(let i = 0; i < nodeTransforms.length; i++) {
        const transform = nodeTransforms[i]
        const onExit = transform(node, context)
        if(onExit) {
            exitFns.push(onExit)
        }
    }
    switch(type) {
        case NodeTypes.INTERPOLATION: 
            //插值的点 在于后续生成 render代码时获取变量的值
            context.helper(TO_DISPLAY_STRING)
            break
        case NodeTypes.ROOT:
        case NodeTypes.ELEMENT:
            //traverseChildren里面继续递归调用traverseNode
            traverseChildren(node, context)
            break
        default: 
            break
    }
    let i = exitFns.length
    //当转换函数处于进入阶段时先从父结点进入在都子节点，退出阶段，先退出子节点，在推出父结点
    //反序执行回调函数栈，则能够保证后序注册的函数执行完毕，还能保证该函数的所有子节点已经执行完毕
    while(i--) {
        exitFns[i]()
    }
}
function traverseChildren(parent: any, context: any) {
    parent.children?.forEach((node) => {
        traverseNode(node,context)
    })
}
function createTransformContext(root, options): any {
    const context = {
        root,
        nodeTransforms: options.nodeTransforms || [],
        helpers: new Map(),
        helper(name) {
            //收集调用的次数
            //收集次数是为了给删除做处理，当只有count为0时才需要删除
            const count = context.helpers.get(name) || 0
            context.helpers.set(name,count + 1)
        }
    }
    return context
}
function createRootCodegen(root: any, context: any) {
    const { children} = root
    //只支持一个根结点
    const child = children[0]

    //element类型的话，就把它的codegenNode赋值给root
    //root是空的 什么数据都没有
    //额外处理codegenNode
    //codegenNode的目的是专门为了codegen准备的 为的就是和ast的node分开
    if(child.type === NodeTypes.ELEMENT && child.codegenNode) {
        const codegenNode = child.codegenNode
        root.codegenNode = codegenNode
    }else {
        root.codegenNode = child
    }
}