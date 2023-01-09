import { camelize, hyphenate, toHandlerKey } from "@mini-vue3/shared";
export function emit(instance,event: string, ...rawArgs) {
    //emit是基于props里面的onXXX的函数进行匹配
    //先从props中看看是否有对应的event handler
    const props = instance.props;
    //烤肉串名需要转换为驼峰名
    let handler = props[toHandlerKey(camelize(event))]
    //如果上面没有匹配，那么检测一下event是否是kebab-case类型
    if(!handler) {
        handler = props[(toHandlerKey(hyphenate(event)))]
    }
    if(handler) {
        handler(...rawArgs)
    }
}