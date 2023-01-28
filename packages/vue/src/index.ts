//这个文件即vue模块
import * as runtimeDom from "@mini-vue3/runtime-dom"
import { registerRuntimeCompiler } from "@mini-vue3/runtime-dom"
import { baseCompile } from "@mini-vue3/compiler-core"
export * from "@mini-vue3/runtime-dom"

function compileToFunction(template,options={}){
    const { code } = baseCompile(template, options)
    //调用compiler得到的代码封装在函数内
    //这里依赖runtimeDom的一些函数，所以通过参数的形式注入
    const render = new Function("Vue", code)(runtimeDom)    
    return render
}
registerRuntimeCompiler(compileToFunction)