import { ShapeFlags } from "@mini-vue3/shared"
import { effect } from "@mini-vue3/reactivity"
import { setupComponent } from "./component"
import { createComponentInstance } from "./component"
import { queueJob } from "./scheduler"
import { shouldUpdateComponent } from "./componentRenderUtils"
import { createAppAPI } from "./createApp"
import { normalizeChildren, normalizeVNode, Fragment, Text } from "./vnode"
export function createRenderer(options): any {
    const {
        createElement: hostCreateElemet,
        setElementText: hostSetElementText,
        patchProp: hostPatchProp,
        insert: hostInsert,
        remove: hostRemove,
        setText: hostSetText,
        createText: hostCreateText
    } = options
    const render = (vnode,container) => {
        console.log("调用patch")
        patch(null,vnode,container)
    }
    function patch(
        n1,
        n2,
        container = null,
        anchor = null,
        parentComponent = null
    ) {
        //n2为新的vnode,基于n2的类型判断
        const {type,shapeFlag} = n2
        switch(type) {
            case Text: 
                processText(n1,n2,container);
                break;
            case Fragment:
                processFragement(n1,n2,container)
                break
            default:
                //基于shapeFlag处理
                if(shapeFlag & ShapeFlags.ELEMENT) {
                    console.log("处理element")
                    processElement(n1,n2,container,anchor,parentComponent)
                }else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
                    console.log("处理component")
                    processComponent(n1,n2,container,parentComponent)
                }
        }

    }
    function processFragement(n1: any,n2: any,container: any) {
        //只需要渲染children,然后添加到container内
        if(!n1){
            //初始化children,然后添加到container内
            mountChildren(n2.children,container)
        }
    }
    function processText(n1: any,n2: any,container: any) {
        //处理Text结点
        if(n1 === null) {
            //n1是null，说明是init阶段
            //基于createText创建出text结点，使用insert添加到el内
            console.log("初始化Text类型的结点")
            hostInsert((n2.el = hostCreateText(n2.children as string)),container)
        }else{
            //update
            //先对比下 updated之后的内容和之前的是否一样
            //不一样需要update text
            //n1赋值给n2?
            const el =(n2.el =n1.el!)
            if(n2.children !== n1.children) {
                console.log('更新Text类型结点')
                hostSetText(el,n2.children as string)
            }
        }
    }
    function processElement(n1,n2,container,anchor,parentComponent) {
        if(!n1){
            mountElement(n2,container,anchor)
        }else{
            updateElement(n1,n2,container,anchor,parentComponent)
        }
    }
    
    function updateElement(n1,n2,container,anchor,parentComponent) {
        const oldProps = (n1 && n1.props) || {}
        const newProps = n2.props || {}
        //把el挂载到新的vnode
        const el = (n2.el=n1.el)
        //对比props
        patchProps(el,oldProps,newProps)
        //对比children
        patchChildren(n1,n2,el,anchor,parentComponent)
    }
    
    function patchProps(el,oldProps,newProps) {
        //oldProps里有，newProps也有，但是值变了
        for(const key in newProps) {
            const prevProp = oldProps[key]
            const nextProp = newProps[key]
            if(prevProp !== nextProp) {
                //对比属性
                hostPatchProp(el,key,prevProp,nextProp)
            }
        }
        //oldProps里有但是newProps里面没有的要删除
        for(const key in oldProps){
            const prevProp = oldProps[key]
            if(!(key in newProps)){
                //以oldProps为基准遍历
                //而且得到的值是newProps内没有的
                //所以交给host更新时，把新的值设置为null
                hostPatchProp(el,key,prevProp,null)
            }
        }
    }
    function patchChildren(n1,n2,container,anchor,parentComponent) {
        const {shapeFlag:prevShapeFlag,children: c1} =n1
        const {shapeFlag,children:c2} = n2
        /*如果n2的children是text类型，看看和之前的n1的children是否一样
        不一样就重新设置一下text */
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
            if(c1 !== c2) {
                console.log("类型为text_childrn，当前需要更新")
                hostSetElementText(container,c2 as string)
            }
        }else {
            //如果之前是array_children,现在也是array_children,就需要对比
            if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    patchKeyedChildren(c1, c2, container, anchor, parentComponent);
                  }
            }
        }
    }
    function patchKeyedChildren(
        c1: any[],
        c2: any[],
        container,
        parentAnchor,
        parentComponent
    ){
        let i=0;
        const l2 = c2.length;
        let e1 = c1.length-1;
        let e2 = l2-1;
        const isSameVNodeType = (n1,n2) => {
            return n1.type === n2.type && n1.key === n2.key
        }
        //从左往右比对子节点
        while(i<=e1 && i<=e2) {
            const prevChild = c1[i]
            const nextChild = c2[i]
            if(!isSameVNodeType(prevChild,nextChild)) {
                console.log("两个child不相等(从左往右比对")
                console.log(`prevChild:${prevChild}`)
                console.log(`nextChild: ${nextChild}`)
                break;
            }
            console.log("两个child相等，接下来对比这两个child节点从左往右比对")
            patch(prevChild,nextChild,container,parentAnchor,parentComponent)
            i++;
        }
        while(i<e1 && i<e2) {
            //从右向左取值
            const prevChild = c1[e1]
            const nextChild = c2[e2]
            if(!isSameVNodeType(prevChild,nextChild)){
                console.log("两个child不相等（从右往左比对")
                console.log(`prevChild:${prevChild}`)
                console.log(`nextChild:${nextChild}`)
                break;
            }
            console.log("两个child相等，接下来对比这两个child节点（从右往左比对)")
            patch(prevChild,nextChild,container,parentAnchor,parentComponent)
            e1--;
            e2--;
        } 
        //新节点的数量大于旧结点的数量，新增vnode
        //循环c2 新的结点
        if(i>e2 && i<=e2) {
            //从e2+1处取到锚点位置，
            const nextPos = e2+1
            const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor
            while(i<=e2) {
                console.log(`需要新创建一个vnode:${c2[i].key}`)
                patch(null,c2[i],container,anchor,parentComponent)
                i++
            }
        }else if(i>e2&&i<=e1) {
            //旧结点多于新结点，需要卸载结点
            while(i<=e1) {
                console.log(`需要删除当前的vnode:${c1[i].key}`)
                hostRemove(c1[i].el)
                i++
            }
        }else{
            //左右两边对比完就处理中间部位顺序变动的
            let s1 = i
            let s2 = i
            const keyToNewIndexMap = new Map()
            let moved = false
            let maxNewIndexSoFar = 0
            //绑定key和newIndex
            for(let i=s2;i<=e2;i++){
                const nextChild = c2[i]
                keyToNewIndexMap.set(nextChild.key,i)
            }
            //需要处理的新节点的数量
            let toBePatched = e2-s2+1
            let patched = 0
            let newIndexToOldIndexMap = new Array(toBePatched)
            //初始化newIndexToOlsIndexMap为0，后面处理如果发现是0，说明新值在老的里面不存在
            for(let i=0;i<toBePatched;i++)newIndexToOldIndexMap[i]=0
            //遍历老结点，新节点没有的结点删除，新老结点都有的需要patch
            for(i=s1;i<=e1;i++){
                const prevChild = c1[i]
                //如果老的节点大于新节点的数量，处理老节点的时候直接删除即可
                if(patched >= toBePatched) {
                    hostRemove(prevChild.el)
                    continue
                }
                let newIndex;
                if(prevChild.key !== null) {
                    //通过key快速查找，看看新的里面这个节点是否存在
                    newIndex = keyToNewIndexMap.get(prevChild.key)
                }else {
                    //没有key就遍历所有新节点来确定当前结点是否存在
                    for(let j = s2;j<=e2;j++){
                        if(isSameVNodeType(prevChild,c2[j])){
                            newIndex = j;
                            break
                        }
                    }
                }
                if(newIndex===undefined) {
                    //当前结点不存在于newChildren,把当前结点删除
                    hostRemove(prevChild.el)
                }else{
                    //新老节点都存在
                    console.log("新老节点都存在")
                    //把新节点的索引和老结点的索引建立映射关系
                    //i+1是因为i可能是0,0被认为新节点在老节点中不存在
                    newIndexToOldIndexMap[newIndex-s2] = i+1
                    //确定中间结点是否需要移动
                    //新的newIndex如果一直升序，说明没有移动
                    //记录最后一个结点在新的里面的索引，看看是否升序
                    //不是升序，确定结点移动过
                    if(newIndex >= maxNewIndexSoFar) {
                        maxNewIndexSoFar = newIndex
                    }else{
                        moved = true
                    }
                    patch(prevChild,c2[newIndex],container,null,parentComponent)
                    patched++
                }
            }
            //利用最长递增子序列优化移动逻辑
            //因为元素升序，那么这些元素不需要移动
            //通过最长递增子序列获取到升序的列表
            //在移动的时候去对比列表，如果对比上，说明元素不需要移动
            //通过moved进行优化，如果没有移动过的话，就不需要执行算法
            //getSequence返回的是newIndexToOldIndexMap的索引值
            //所以后面可以直接遍历索引值处理，也就是直接使用toBePatched
            const increasingNewIndexSequence = moved
                ? getSequence(newIndexToOldIndexMap)
                : []
            let j = increasingNewIndexSequence.length - 1
            /*遍历新节点：
            1.找出老节点没有的 而新节点有的 需要把这个节点创建
            2.最后移动一下位置
            倒循环是因为在insert时，需要保证锚点是处理完的结点，也就是已经确定位置了 
            insert逻辑是使用的insertBefore()*/
            for(let i = toBePatched-1;i>=0;i--){
                //确定当前要处理的节点索引
                const nextIndex = s2+i
                const nextChild = c2[nextIndex]
                //锚点等于当前节点索引+1
                const anchor = nextIndex + 1 < l2 ? c2[nextIndex+1].el : parentAnchor
                if(newIndexToOldIndexMap[i]===0) {
                    //说明新节点在老的里面不存在
                    //需要创建
                    patch(null,nextChild,container,anchor,parentComponent)
                }else if(moved) {
                    //需要移动
                    //j已经没有了 说明剩下的都需要移动
                    //最长递增子序列里面的值和当前值不匹配，说当前元素需要移动
                    if(j<0 || increasingNewIndexSequence[j] !== i ){
                        //移动用insert
                        hostInsert(nextChild.el,container,anchor)
                    }else{
                        //命中了index和最长递增子序列的值
                        //移动指针
                        j--
                    }
                }
            }
        }       
    }
    function mountElement(vnode,container,anchor) {
        const {shapeFlag, props} = vnode
        //先创建element
        const el = (vnode.el = hostCreateElemet(vnode.type))
        //支持单子组件和多子组件的创建
        if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            /*一层直接渲染*/
            console.log(`处理文本${vnode.children}`)
            hostSetElementText(el,vnode.children)
        }else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            /*
            render(){
                return h("div",{},[h("p"),h(Hello)])
            }
            */
           //children是个数组，一次调用patch递归处理
           mountChildren(vnode.children,el)
        }
        //处理props
        if(props) {
            for(const key in props) {
                //过滤vue自身用的key,比如生命周期相关的key:beforeMount,mounted
                const nextVal = props[key]
                hostPatchProp(el,key,null,nextVal)
            }
        }
        //触发beforeMount()钩子
        console.log("vnodeHook -> onVnodeBeforeMount")
        console.log("DirectiveHook -> beforeMount")
        console.log("transition -> beforeEnter")

        //插入
        hostInsert(el,container,anchor)
        //触发mounted()钩子
        console.log("vnodeHook -> onVnodeMounted")
        console.log("DirectiveHook -> mounted")
        console.log("transition -> enter")
    }
    function mountChildren(children,container){
        children.forEach((VNodeChild) => {
            //处理vnodeChild,可能不是vnode类型
            console.log("mountChildren",VNodeChild)
            patch(null,VNodeChild,container)
        })
    }
    function processComponent(n1,n2,container,parentComponent) {
        //如果n1没有值，那么就是mount
        if(!n1) {
            //初始化component
            mountComponent(n2,container,parentComponent)
        }else{
            updateComponent(n1,n2,container)
        }
    }

    function updateComponent(n1,n2,container) {
        console.log("更新组件",n1,n2)
        //更新组件实例引用
        const instance = (n2.component = n1.component)
        //先看看这个组件是否应该更新
        if(shouldUpdateComponent(n1,n2)){
            console.log(`组件需要更新：${instance}`)
            //next就是新的vnode
            instance.next=n2
            /*update是在setupRenderEffect 里面初始化的，update函数除了当内部响应式对象
            发生改变的时候会调用，还可以直接主动调用（属于effect的特性），调用update再次调用patch逻辑
            在update中调用的next就变成了了n2*/ 
            instance.update()
        }else{
            console.log(`组件不需要更新:${instance}`)
            n2.component=n2.component
            n2.el=n1.el
            instance.vnode=n2
        }
    }
    function mountComponent(initialVNode,container,parentComponent) {
        //先创建一个component instance
        const instance = (initialVNode.component = createComponentInstance(
            initialVNode,
            parentComponent
        ))
        console.log(`创建组件实例：${instance.type.name}`)
        //给Instance加工
        setupComponent(instance)
        setupRenderEffect(instance,initialVNode,container)           
    }
    
    function setupRenderEffect(instance,initialVNode,container) {
        function componentUpdateFn(){
            //组件还没挂载
            if(!instance.isMounted) {
                //组件初始化，要调用render函数，因为在effect内调用render才能好触发依赖收集
                //等到后面响应式的值变更后会再次触发函数
                const proxyToUse = instance.proxy
                //在render函数将this指向proxy
                const subTree = (instance.subTree = normalizeVNode(
                    instance.render.call(proxyToUse,proxyToUse)
                ))
                console.log("subTree",subTree)
                console.log(`${instance.type.name}:触发 beforeMount hook`)
                console.log(`${instance.type.name}:触发 onVnodeBeforeMount hook`)
                //基于subTree再次调用patch
                //基于render返回的vnode,再次进行渲染,递归渲染subTree
                patch(null,subTree,container,null,instance)
                //把root element赋值给组件的vnode.el,为后续调用$el的时候获取值
                initialVNode.el = subTree?.el
                console.log(`${instance.type.name}:触发mounted hook`)
                instance.isMounted=true
            }else{
                //响应式数据变更后拿到新的vnode和之前的vnode进行对比
                console.log(`${instance.type.name}:调用更新逻辑`)
                const { next,vnode} = instance
                //有next 需要更新组件数据
                //先更新组件数据 更新完成后再继续对比当前子元素
                if(next){
                    next.el = vnode.el
                    updateComponentPreRender(instance,next)
                }
                //instance.proxy=>instance.ctx
                const proxyToUse = instance.proxy
                const nextTree = normalizeVNode(
                    instance.render.call(proxyToUse,proxyToUse)
                )
                //替换之前的subTree
                const preTree = instance.subTree
                instance.subTree = nextTree
                //触发beforeUpdated hook
                console.log(`${instance.type.name}:触发beforeUpdated hook`)
                console.log(`${instance.type.name}:触发onVnodeBeforeUpdate hook`)
                //旧的vnode和新的vnode交给patch处理
                patch(preTree,nextTree,preTree.el,null,instance)
                //触发updated hook
                console.log(`${instance.type.name}:触发updated hook`)
                console.log(`${instance.type.name}:复发onVnodeUpdated hook`)
            }
        };
        instance.update = effect(componentUpdateFn,{
            scheduler: () => {
                //把effect推到微任务的时候再执行
                //queueJob(effect)
                queueJob(instance.update)
            }
        })
    }
    function updateComponentPreRender(instance,nextVNode){
        nextVNode.component=instance
        instance.vnode = nextVNode
        instance.next=null
        const {props} = nextVNode
        console.log("更新组件的props",props)
        instance.props = props
        console.log("更新组件的slots")
    }
    return {
        render,
        createApp: createAppAPI(render)
    }  
}
//返回最长递增子序列的索引值
function getSequence(arr:number[]):number[] {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = (u + v) >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
}
