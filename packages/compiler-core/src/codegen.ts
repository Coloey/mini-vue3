import { isString } from "@mini-vue3/shared"
import { NodeTypes } from "./ast"
import { CREATE_ELEMENT_VNODE, helperNameMap, TO_DISPLAY_STRING } from "./runtimeHelpers"

export function generate(ast, options = {}) {
    //生成context
    const context = createCodegenContext(ast, options)
    const { push, mode} = context
    //先生成preambleContext
    if(mode === 'module') {
        genModulePreamble(ast,context)
    }else{
        genFunctionPreamble(ast,context)
    }
    const functionName = "render"
    const args = ["_ctx"]
    //将args处理成string
    const signature = args.join(", ")
    push(`function ${functionName}(${signature}){`)
    //生成具体代码内容
    push("return ")
    genNode(ast.codegenNode,context)
    push("}")
    return {
        code: context.code
    }
}

function genInterpolation(node: any, context: any){
    const { push, helper } = context
    push(`${helper(TO_DISPLAY_STRING)}(`)
    genNode(node.content,context)
    push(")")
}

function genNullableArgs(args){
    //把末尾为null的删除
    let i = args.length
    while(i--) {
        if(args[i] !== null) break;
    }
    //把为falsy的值替换为null,falsy的值有false,0,-0,0n,'',null,undefined,NAN
    return args.slice(0,i+1).map((arg) => arg || 'null')
}

function genNodeList(nodes: any, context: any){
    const { push } = context;
    for(let i=0; i < nodes.length; i++) {
        const node = nodes[i]
        if(isString(node)) {
            push(`${node}`);
        }else {
            genNode(node, context);
        }
        if( i < nodes.length-1) {
            push(", ");
        }
    }
}

function genElement(node, context) {
    const { push, helper} = context;
    const { tag, props, children} = node;
    push(`${helper(CREATE_ELEMENT_VNODE)}(`);
    genNodeList(genNullableArgs([tag, props, children]), context);
    push(`)`)
}

function genText(node: any, context: any) {
    const { push } = context;
    push(`'${node.content}'`);
}

function genCompoundExpression(node: any, context: any){
    const { push } = context;
    for(let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if(isString(child)) {
            push(child)
        }else {
            genNode(child, context)
        }
    }
}

function genModulePreamble(ast, context){
    const { push,newline,runtimeModuleName} = context
    //比如ast.helpers里面有个[toDisplayString]
    //生成后就是import {toDisplayString as _toDisplayString} from "vue"
   if(ast.helpes.length){
    const code =  `import {${ast.helpers
        .map((s) => `${helperNameMap[s]} as _${helperNameMap[s]}`)
        .join(", ")} } from ${JSON.stringify(runtimeModuleName)}`;
    push(code)   
   }
   newline();
   push(`export `);  
}

function genFunctionPreamble(ast: any, context: any) {
    const { runtimeGlobalName,push,newline} = context
    const VueBinging = runtimeGlobalName
    const aliasHelper = (s) => `${helperNameMap[s]} : _${helperNameMap[s]}`
    //?
    if(ast.helpers.length > 0) {
        push(
            `
                const { ${ast.helpers.map(aliasHelper).join(", ")}} = ${VueBinging}
            `
        )
    }
    newline()
    push(`return `)
}

function genExpression(node: any, context: any){
    context.push(node.content, node)
}

//规则：读取node,基于不同node生成对应代码块，将代码拼接到一起
function genNode(node: any, context: any) {
    switch(node?.type) {
        case NodeTypes.INTERPOLATION:
            genInterpolation(node, context);
            break;
        case NodeTypes.SIMPLE_EXPRESSION:
            genExpression(node,context);
            break;
        case NodeTypes.ELEMENT:
            genElement(node, context);
            break;
        case NodeTypes.COMPOUND_EXPRESSION:
            genCompoundExpression(node, context);
            break;
        case NodeTypes.TEXT:
            genText(node, context);
            break;
        default:
            break;

    }
}

function createCodegenContext(
    ast: any,
    { runtimeModuleName = "vue", runtimeGlobalName = "Vue",mode = "function"}
): any {
    const context = {
        code: '',
        mode,
        runtimeGlobalName,
        runtimeModuleName,
        helper(key) {
            return `_${helperNameMap[key]}`
        },
        push(code) {
            context.code += code
        },
        newline() {
            context.code += '\n'
        }
    }
    return context
}