import { isArr, isObj, keysOf, mapObj } from "./helpers"
import type { Obj } from "@/types"

export function sortObj<T extends Obj = Obj>(obj: T): T {
    return keysOf(obj).sort().reduce((v, k) => {
        v[k] = obj[k]
        return v
    }, {} as T)
}

export function deepSort<T>(value: T): T {
    if (isObj(value)) {
        return mapObj(sortObj(value), deepSort) as T
    }
    if (isArr(value)) {
        return value.map(deepSort).sort() as T
    }
    return value
}
