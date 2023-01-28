import { generate } from "./codegen"
import { transform } from "./transform"
import { transformExpression } from "./transforms/transformExpression"
import { transformText } from "./transforms/transformText"
import { transformElement } from "./transforms/transfromElement"
import { baseParse } from "./parse"
export function baseCompile(template,options) {
    const ast = baseParse(template)
    //ast进行转换
    transform(ast,
        Object.assign(options,{
            nodeTransforms: [transformElement,transformText,transformExpression]
        })
    )
    //生成render函数代码
    return generate(ast) 
}