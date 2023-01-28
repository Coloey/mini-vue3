import ts from "rollup-plugin-typescript2";
import resolvePlugin from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import sourceMaps from "rollup-plugin-sourcemaps";
export default {
  input: "./packages/vue/src/index.ts",
  plugins: [
    replace({
      "process.env.NODE_ENV": JSON.stringify("development"),
      "process.env.VUE_ENV": JSON.stringify("browser"),
      "process.env.LANGUAGE": JSON.stringify(process.env.LAMGUAGE),
    }),
    resolvePlugin(),
    commonjs(),
    ts(),
    sourceMaps(),
  ],
  output: [
    {
      format: "cjs",
      file: "./packages/vue/dist/mini-vue3.cjs.js",
      sourcemap: true,
    },
    {
      name: "vue",
      format: "es",
      file: "/packages/vue/dist/mini-vue3.esm-bundler.js",
      sourcemap: true,
    },
  ],
  onwarn: (msg, warn) => {
    //忽略circular的错误
    if (!/Circular/.test(msg)) {
      warn(msg);
    }
  },
};
