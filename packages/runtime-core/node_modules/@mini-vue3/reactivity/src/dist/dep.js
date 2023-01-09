"use strict";
exports.__esModule = true;
exports.createDep = void 0;
//用于存储所有的effect对象
function createDep(effects) {
    var dep = new Set(effects);
    return dep;
}
exports.createDep = createDep;
