import { h } from "@mini-vue3/runtime-dom"
import { nodeOps, render, serializeInner } from "@mini-vue3/runtime-test"
describe("render: component", () => {
    test("should create an Component", () => {
        const Comp = {
            render: () => {
                return h("div")
            }
        }
        const root = nodeOps.createElement("div")
        render(h(Comp), root)
        expect(serializeInner(root)).toBe(`<div></div>`)
    })
})