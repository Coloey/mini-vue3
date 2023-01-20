import { NodeTypes } from "../ast";
import { isText } from "../utils";

export function transformText(node, context) {
    if(node.type === NodeTypes.ELEMENT) {
        return () => {
            //比如hi,{{msg}}
            //会生成两个节点，一个是text,一个是interpolation
            //涉及到一个'+'操作符
            //检测下一个节点是不是text类型，是的话就创建一个COMPOUND类型
            //COMPOUND类型把2个text||interpolation包裹
            const children = node.children
            let currentContainer
            for(let i = 0;i < children.length;i++) {
                const child = children[i]
                //如果当前节点时text
                if(isText(child)){
                    for(let j = i + 1; j < children.length; j++) {
                        const next = children[j]
                        //如果下一个节点也是text类
                        if(isText(next)){
                            //currentContainer的目的是把相邻结点都放到一个容器
                            if(!currentContainer){
                                currentContainer = children[i] = {
                                    type: NodeTypes.COMPOUND_EXPRESSION,
                                    loc: child.loc,
                                    children: [child]
                                }
                            }
                            currentContainer.children.push(` + `, next)
                            //把当前结点放到容器，然后删除j
                            children.splice(j,1)
                            j--
                        }else {
                            currentContainer = undefined
                            break
                        }
                    }
                }
               
            }
        }
    }
}