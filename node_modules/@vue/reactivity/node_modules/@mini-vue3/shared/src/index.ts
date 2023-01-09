export const isObject = (value) =>{
  return typeof value === 'object' && value !== null
}
   
/**
 * 判断函数
 */
export const isFunction= (value) =>{
   return typeof value === 'function'
}
​
/**
 * 判断字符串
 */
export const isString = (value) => {
   return typeof value === 'string'
}
​
/**
 * 判断数字
 */
export const isNumber =(value)=>{
   return typeof value === 'number'
}
​
/**
 * 判断数组
 */
export const isArray = Array.isArray
export const extend = Object.assign
export function hasChanged(value,oldValue) {
	return !Object.is(value,oldValue)
}
//转为驼峰
const camelizeRE=/(-)(\w)/g
export const camelize = (str: string):string => {
	return str.replace(camelizeRE,(_,c)=>(c ? c.toUpperCase() : ""))
}
export function hasOwn(val,key){
	return Object.prototype.hasOwnProperty.call(val,key)
}
//首字母大写
export const capitalize = (str: string) =>
	str.charAt(0).toUpperCase()+str.slice(1)
export function isOn = (key) => /^on[A-Z]/.test(key)
//添加on前缀，并且首字母大写
export const toHandlerKey = (key: string) => 
	str ? `on${capitalize(str)}` : ``
//用来匹配kebab-case的情况
/*比如onTest-event 可以匹配到T,取到T在前面加一个 - \B可以匹配到大写字母
前面那个位置，加一个- */
const hyphenateRE = /\B([A-Z])/g
//驼峰转烤肉串
export const hyphenate = (str: string) => 
	str.replace(hyphenateRE,'-$1').toLowerCase()