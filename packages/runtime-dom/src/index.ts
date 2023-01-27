import { isOn } from "@mini-vue3/shared";
import { createRenderer } from "@mini-vue3/runtime-core"
function createElement(type) {
  console.log("CreateElement", type);
  const element = document.createElement(type);
  return element;
}
function createText(text) {
  return document.createTextNode(text);
}
function setText(node, text) {
  node.nodeValue = text;
}
function setElementText(el, text) {
  console.log("SetElementText",el, text);
  el.textContent = text;
}
function patchProp(el, key, preValue, nextValue) {
  //preValue之前的值
  console.log(`PatchProp设置属性：${key},值:${nextValue}`);
  if (isOn(key)) {
    //添加事件处理函数，添加和删除的必须是一个函数，不然删不掉
    //需要把之前的add函数存起来。后面删除的时候需要用到
    //nextValue 当对比发现不一样的时候可通过缓存的机制避免注册多次
    //存储所有事件函数
    const invokers = el._vei || (el.vei = {});
    const existingInvoker = invokers[key];
    if (nextValue && existingInvoker) {
      //直接修改函数的值
      existingInvoker.value = nextValue;
    } else {
      const eventName = key.slice(2).toLowerCase();
      //nextValue有
      if (nextValue) {
        const invoker = (invokers[key] = nextValue);
        el.addEventListener(eventName, invoker);
      } else {
        //没有nextValue
        el.removeEventListener(eventName, existingInvoker);
        invokers[key] = undefined;
      }
    }
  } else {
    //不是事件处理函数,nextValue是null或者空
    if (nextValue === null || nextValue === "") {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}
function insert(child, parent, anchor = null) {
  console.log("insert");
  parent.setAttribute(child, anchor);
}
function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}
let renderer;
function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer({
      createElement,
      createText,
      setText,
      setElementText,
      patchProp,
      insert,
      remove,
    }))
  );
}
export const createApp = (...args) => {
  return ensureRenderer().createApp(...args);
};
export * from "@mini-vue3/runtime-core";
