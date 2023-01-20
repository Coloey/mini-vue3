import { generate } from "../src/codegen"
import { baseCompile } from "../src/compile"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"
import { transformExpression } from "../src/transforms/transformExpression"
import { transformText } from "../src/transforms/transformText"
import { transformElement } from "../src/transforms/transfromElement"
test("interpolation module",() => {
    const ast = baseParse("{{hello}}");
    transform(ast, {
        nodeTransforms: [transformExpression]
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
});

test("element and interpolation", () => {
    const ast = baseParse("<div>hi,{{msg}}</div>");
    transform(ast, {
        nodeTransforms: [transformElement, transformText, transformExpression]
    });
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
})