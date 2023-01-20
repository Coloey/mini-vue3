import { ReactiveEffect } from "./effect"
export type Dep = Set<ReactiveEffect>
//用于存储所有的effect对象
export function createDep(effects?: ReactiveEffect[]): Dep {
    const dep=new Set<ReactiveEffect>(effects) as Dep
    return dep
}