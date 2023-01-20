import { computed }from "../src/computed"
import { reactive } from "../src/reactive"
import { effect } from "../src/effect"
describe("computed", () => {
    //断言
    it("test computed", () => {
        const value = reactive({
            foo: 1,
        })
        const getter = computed(()=>{
            return value.foo;
        })
        value.foo = 2;
        expect(getter.value).toBe(2);
    })
    it("should compute lazily", () => {
        const value = reactive({
            foo: 1,
        });
        const getter = jest.fn(() => {
            return value.foo;
        })
        const cValue = computed(getter);
        //lazy
        expect(getter).not.toHaveBeenCalled();
        expect(cValue.value).toBe(1)
        expect(getter).toHaveBeenCalledTimes(1)
        //should not compute again
        cValue.value
        expect(getter).toHaveBeenCalledTimes(1)
        //should not compute util needed
        value.foo = 2
        expect(getter).toHaveBeenCalledTimes(1)
        //now it should compute
        expect(cValue.value).toBe(2)
        expect(getter).toHaveBeenCalledTimes(2)
        //should not compute again
        cValue.value
        expect(getter).toHaveBeenCalledTimes(2)
    });
    it("should trigger effect", () => {
        const value = reactive({
            foo: 1
        })
        const cValue = computed(() => value.foo)
        let dummy
        effect(() => {
            dummy = cValue.value
        })
        value.foo = 1
        expect(dummy).toBe(1)
    })
});
