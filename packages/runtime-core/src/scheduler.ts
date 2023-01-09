const queue: any[] = []
const activePreFlushCbs: any = []
const p = Promise.resolve()
let isFlushPending  = false 
export function nextTick(fn?) {
    return fn ? p.then(fn) : p
}
export function queueJob(job) {
    if(!queue.includes(job)){
        queue.push(job)
        //执行所有job
        queueFlush()
    }
}
function queueFlush(){
    //多个组件更新，触发一次then即可
    //触发过一次nextTick 后面不需要再触发一次
    if(isFlushPending)return 
    isFlushPending = true
    nextTick(flushJobs)
}
export function queuePreFlushCb(cb) {
    queueCb(cb,activePreFlushCbs)
}
function queueCb(cb,activeQueue){
    activeQueue.push(cb)
    //执行队列里所有job
    queueFlush()
}
function flushJobs() {
    isFlushPending=false
    //先执行pre类型的job
    //执行这里的job时 页面还没渲染
    flushPreFlushCbs()
    let job
    while((job = queue.shift())){
        if(job){
            job()
        }
    }
}
function flushPreFlushCbs() {
    //执行所有pre类型的job
    for(ley i=0;i<activePreFlushCbs.length;i++){
        activePreFlushCbs[i]()
    }
}