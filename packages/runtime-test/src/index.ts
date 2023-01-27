import { createRenderer } from "@mini-vue3/runtime-core";
import { extend } from "@mini-vue3/shared";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
export const {render} = createRenderer(extend({patchProp},nodeOps))
export * from "./nodeOps"
export * from "./patchProp"
export * from "@mini-vue3/runtime-core"
export * from "./serialize"