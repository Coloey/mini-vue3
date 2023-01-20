import { effect } from "../src/effect"

describe("effect", () => {
    it("it should run the pass function once", () => {
        const fnSpy = jest.fn(() => {})
        effect(fnSpy)
        expect(fnSpy).toHaveBeenCalledTimes(1)
    })
})