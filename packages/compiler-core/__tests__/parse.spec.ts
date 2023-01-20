import { ElementTypes, NodeTypes } from "../src/ast";
import { baseParse } from "../src/parse"

describe("parser", () => {
    describe("text", () => {
        test("simple text", () => {
            const ast = baseParse("some text");
            const text = ast.children[0];
            expect(text).toStrictEqual({
                type: NodeTypes.TEXT,
                content: "some text"
            });
        });

        test("text with interpolation", () => {
            const ast = baseParse("some {{ foo + bar }} text");
            const text1 = ast.children[0];
            const text2 = ast.children[2];
            //ast.children[1]是interpolation
            expect(text1).toStrictEqual({
                type: NodeTypes.TEXT,
                content: "some "
            });
            expect(text2).toStrictEqual({
                type: NodeTypes.TEXT,
                content: " text"
            })
        })       
    });
    describe("Interpolation", () => {
        test("simple interpolation", () => {
            const ast = baseParse("{{message}}");
            const interpolation = ast.children[0];
            expect(interpolation).toStrictEqual({
                type: NodeTypes.INTERPOLATION,
                content: {
                    type: NodeTypes.SIMPLE_EXPRESSION,
                    content: `message`,
                }
            })
        })
    });
    describe("Element", () => {
        //测试
        test("simple div", () => {
            const ast = baseParse("<div>hello</div>");
            const element = ast.children[0];
            expect(element).toStrictEqual({
                type: NodeTypes.ELEMENT,
                tag: 'div',
                tagType: ElementTypes.ELEMENT,
                children: [
                    {
                        type: NodeTypes.TEXT,
                        content: 'hello',                        
                    }
                ]
            });
        });

        test("element with interpolation", () => {
            const ast = baseParse("<div>{{msg}}</div>");
            const element = ast.children[0];
            expect(element).toStrictEqual({
                type: NodeTypes.ELEMENT,
                tag: 'div',
                tagType: ElementTypes.ELEMENT,
                children: [
                    {
                        type: NodeTypes.INTERPOLATION,                        
                        content: {
                            type: NodeTypes.SIMPLE_EXPRESSION,
                            content: `msg`,
                        }
                    }
                ]
            });
        });

        test("element with interpolation and text", () => {
            const ast = baseParse("<div>hi,{{msg}}</div>");
            const element = ast.children[0];
            expect(element).toStrictEqual({
                type: NodeTypes.ELEMENT,
                tag: 'div',
                tagType: ElementTypes.ELEMENT,
                children: [
                    {
                        type: NodeTypes.TEXT,
                        content: "hi,"
                    },
                    {
                        type: NodeTypes.INTERPOLATION,
                        content: {
                            type: NodeTypes.SIMPLE_EXPRESSION,
                            content: 'msg',
                        }
                    }
                ]
            })
        })
    })

})