import { computed } from "../src/computed"
import { effect } from "../src/effect"
import { reactive } from "../src/reactive"
import {isRef, proxyRefs, ref, unRef} from "../src/ref"
describe("reactive/ref", () => {
    test('should hold a value', () => {
        const a = ref(1)
        expect(a.value).toBe(1)
        a.value = 2
        expect(a.value).toBe(2)
    })
    test("should be reactive", () => {
        const a = ref(1)
        let dummy 
        let calls = 0
        effect(() => {
            calls++
            dummy = a.value
        })
        expect(calls).toBe(1)
        expect(dummy).toBe(1)
        a.value = 2
        expect(calls).toBe(2)
        expect(dummy).toBe(2)
        a.value = 2
        //same value should not trigger
        expect(calls).toBe(2)
    })
    test("should make nested properties reactive", () => {
        const a = ref({
            count: 1
        })
        let dummy
        effect(() => {
            dummy = a.value.count
        })
        expect(dummy).toBe(1)
        a.value.count = 2
        expect(dummy).toBe(2)
    })
    test("unRef", () => {
       expect(unRef(1)).toBe(1)
       expect(unRef(ref(1))).toBe(1)
    })
    test('isRef', () => {
        expect(isRef(ref(1))).toBe(true)
        expect(isRef(0)).toBe(false)
        expect(isRef(1)).toBe(false)
        expect(isRef({ value: 0 })).toBe(false)
    })
    // test("toRef", () => {
    //     const a = reactive({
    //         x:1
    //     })
    //     const x = toRef(a, 'x')
    //     expect(isRef(x)).toBe(true)
    //     expect(x.value).toBe(1)
    //     a.x = 2
    //     expect(x.value).toBe(2)
    //     x.value = 3
    //     expect(a.x).toBe(3)
    // })
    test("unRef", () => {
        const a = ref(1)
        expect(unRef(a)).toBe(1)
    })
})