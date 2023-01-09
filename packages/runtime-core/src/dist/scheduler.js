"use strict";
exports.__esModule = true;
exports.queuePreFlushCb = exports.queueJob = exports.nextTick = void 0;
var queue = [];
var activePreFlushCbs = [];
var p = Promise.resolve();
var isFlushPending = false;
function nextTick(fn) {
    return fn ? p.then(fn) : p;
}
exports.nextTick = nextTick;
function queueJob(job) {
    if (!queue.includes(job)) {
        queue.push(job);
        //执行所有job
        queueFlush();
    }
}
exports.queueJob = queueJob;
function queueFlush() {
    //多个组件更新，触发一次then即可
    //触发过一次nextTick 后面不需要再触发一次
    if (isFlushPending)
        return;
    isFlushPending = true;
    nextTick(flushJobs);
}
function queuePreFlushCb(cb) {
    queueCb(cb, activePreFlushCbs);
}
exports.queuePreFlushCb = queuePreFlushCb;
function queueCb(cb, activeQueue) {
    activeQueue.push(cb);
    //执行队列里所有job
    queueFlush();
}
function flushJobs() {
    isFlushPending = false;
    //先执行pre类型的job
    //执行这里的job时 页面还没渲染
    flushPreFlushCbs();
    var job;
    while ((job = queue.shift())) {
        if (job) {
            job();
        }
    }
}
function flushPreFlushCbs() {
    //执行所有pre类型的job
    for (ley; i = 0; i < activePreFlushCbs.length)
        ;
    i++;
    {
        activePreFlushCbs[i]();
    }
}
