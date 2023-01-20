/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  watchPathIgnorePatterns: ["/node_modules/", "/dist/", "/.git/"],
  moduleFileExtensions: ["ts", "tsx", "js", "json"],
  moduleNameMapper: {
    "^@mini-vue3(.*?)$": "<rootDir>/packages/$1/src",
  },
  rootDir: __dirname,
  testRegex: "(/test/.*|\\.(test|spec))\\.(ts|tsx|js)$",
  testPathIgnorePatterns: ["/node_modules/"],
};
