export function initProps(instance,rawProps) {
    console.log("initProps")
    //如果组件声明了props,才进入props属性内，否则存储在attrs内
    instance.props = rawProps
}