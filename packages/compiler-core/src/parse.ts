import { ElementTypes, NodeTypes } from "./ast"

const enum TagType {
    Start,
    End
}
export function baseParse(content: string) {
    const context = createParserContext(content)
    return createRoot(parseChildren(context,[]))
}
function createParserContext(content) {
    console.log("创建parserContext")
    return {
        source: content
    }
}
function parseChildren(context,ancestors) {
    console.log("开始解析children")
    const nodes: any =[]
    while(!isEnd(context,ancestors)) {
        let node 
        const s = context.source
        if(startWith(s,"{{")) {
            //看看如果是{{开头 就是插值，解析
            node = parseInterpolation(context)
        }else if(s[0] === '<') {
            if(s[1] === '/') {
                //处理结束标签
                if(/[a-z]/i.test(s[2])) {
                    //匹配</div>
                    parseTag(context, TagType.End)
                    continue;
                }
            }else if(/[a-z]/i.test(s[1])) {
                node = parseElement(context, ancestors)
            }
        }
        if(!node) {
            node = parseText(context)
        }
        nodes.push(node)
    }
    return nodes
}

function createRoot(children){
    return {
        type: NodeTypes.ROOT,
        children,
        helpers: []
    }
}
function isEnd(context: any, ancestors) {
    //检测标签的节点
    //如果是结束标签，看看之前有没有开始标签，如果有，返回true
    const s = context.source
    if(context.source.startsWith("</")) {
        //从后往前查,检查结尾标签和开始会标签是否一致
        for(let i = ancestors.length-1; i >= 0; i--) {
            if(startWithEndTagOpen(s,ancestors[i].tag)) {
                return true
            }
        }
    }
    return !context.source
}
function parseInterpolation(context) {
    //1. 先获取到结束的index
    //2. 通过closeIndex - startIndex获取到内容长度contextLength
    //3.通过slice截取内容
    const openDelimiter = "{{"
    const closeDelimiter = "}}"
    //从{{开始检索
    const closeIndex = context.source.indexOf(
        closeDelimiter,
        openDelimiter.length
    )
    //代码前进2个长度，可以把{{干掉
    advanceBy(context,2)
    
    const rawContentLenth = closeIndex - openDelimiter.length
    const rawContent = context.source.slice(0,rawContentLenth)
    //进入parseData 移动光标消费data字符
    const preTrimContent = parseTextData(context,rawContentLenth)
    const content = preTrimContent.trim()
    //代码前进2个长度 可以把}}干掉
    advanceBy(context, closeDelimiter.length)
    return {
        type: NodeTypes.INTERPOLATION,
        content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content
        }
    }
}

function parseTag(context: any,type: TagType): any {
    //exec方法中返回的第一项是完全匹配成功的文本，后序每项是一个匹配的捕获组，
    const match: any = /^<\/?([a-z][^\r\n\t\f />]*)/i.exec(context.source)
    //匹配到第一个捕获组，标签名
    const tag = match[1]
    //移动光标
    advanceBy(context,match[0].length)
    //先不处理selfClose,移动一个光标>
    advanceBy(context,1)
    if(type === TagType.End)return
    let tagType = ElementTypes.ELEMENT
    return {
        type: NodeTypes.ELEMENT,
        tag,
        tagType
    }
}

function parseElement(context, ancestors) {
    //<div></div>
    //先解析tag
    const element = parseTag(context,TagType.Start)
    //回溯
    ancestors.push(element)
    const children = parseChildren(context, ancestors)
    ancestors.pop()
    //消费到只剩下endTag
    if(startWithEndTagOpen(context.source,element.tag)) {
        parseTag(context,TagType.End)
    }else {
        throw new Error(`缺失结束标签：${element.tag}`)
    }
    element.children = children
    return element
}
function parseText(context) {
    const endTokens = ["<", "{{"]
    let endIndex = context.source.length
    for(let i = 0; i < endTokens.length; i++) {
        const index = context.source.indexOf(endTokens[i])
        //endIndex要尽量小
        if(index !== -1 && endIndex > index) {
            endIndex = index
        }
    }
    const content = parseTextData(context, endIndex)
    return {
        type: NodeTypes.TEXT,
        content
    }
}

function parseTextData(context: any, length: number): any {
    const rawText = context.source.slice(0,length)
    advanceBy(context,length)
    return rawText
}

function advanceBy(context, len) {
    context.source = context.source.slice(len)
}

function startWithEndTagOpen(source: string, tag: string) {
    return (
        startWith(source,'</') && 
        source.slice(2,2+tag.length).toLowerCase() === tag.toLowerCase()
    )
}

function startWith(source: string, searchString: string): boolean {
    return source.startsWith(searchString)
}