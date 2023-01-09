"use strict";

if (process.env.NODE_ENV === "development") {
  module.exports = require("./dist/mini-vue3.cjs.js");
}