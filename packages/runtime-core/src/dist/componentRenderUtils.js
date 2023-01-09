"use strict";
exports.__esModule = true;
exports.shouldUpdateComponent = void 0;
function shouldUpdateComponent(preVNode, nextNode) {
    var prevProps = prevVNode.props;
    var nextProps = nextVNode.props;
    //props没有变化，就不需要更新
    if (prevProps === nextProps)
        return false;
    //如果之前没有props,那么看看现在有没有props
    if (!prevProps)
        return !!nextProps;
    //之前有值，现在没值，那么需要更新
    if (!nextProps)
        return true;
    return hasPropsChanged(prevprops, nextProps);
}
exports.shouldUpdateComponent = shouldUpdateComponent;
function hasPropsChanged(prevProps, nextProps) {
    //对比每一个props.key
    //如果length不一致需要更新
    var nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
        return true;
    }
    //只要现在的prop和之前的props有一个不一样就需要更新
    for (var i = 0; i < nextKeys.length; i++) {
        var key = nextKeys[i];
        if (nextProps[key] !== prevProps[key]) {
            return true;
        }
    }
    return false;
}
