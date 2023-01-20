import { createVNodeCall } from "../ast"
import { NodeTypes } from "../ast"
export function transformElement(node, context) {
    if(node.type === NodeTypes.ELEMENT) {
        return () => {
            const vnodeTag = `'${node.tag}'`
            //暂时不支持props
            let vnodeProps = null 
            let vnodeChildren = null
            if(node.children.length > 0) {
                if(node.children.length === 1) {
                    const child = node.children[0]
                    vnodeChildren = child
                }/*else {
                    vnodeChildren=[]
                    for(let child of node.children){
                        vnodeChildren?.push(child)
                    }
                }*/
            }
            node.codegenNode = createVNodeCall(
                context,
                vnodeTag,
                vnodeProps,
                vnodeChildren
            )

        }
    }
}