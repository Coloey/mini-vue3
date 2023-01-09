//组件类型
export const enum ShapeFlags {
    //最后要渲染的element类型
    ELEMENT = 1,
    //组价类型
    STATEFUL_COMPONENT = 1 << 2,
    //vnode中children为string类型
    TEXT_CHILDREN = 1 << 3,
    //vnode中children位数组类型
    ARRAY_CHILDREN = 1 << 4,
    //vnode中children为slots类型
    SLOTS_CHILDREN = 1 << 5
}