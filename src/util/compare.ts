import { isArr, isObj, keysOf } from "./helpers"
import { deepSort } from "./sort"

export function isDeepEqual(a: unknown, b: unknown): boolean {
    if (isObj(a)) {
        if (!isObj(b)) return false
        const keysA = keysOf(a)
        const keysB = keysOf(b)
        if (keysA.length !== keysB.length) return false
        if (!keysA.every((k, i) => k === keysB[i])) return false
        for (const key of keysA) {
            if (!isDeepEqual(a[key], b[key])) return false
        }
        return true
    }
    if (isArr(a)) {
        if (!isArr(b)) return false
        if (a.length !== b.length) return false
        return a.every((x, i) => isDeepEqual(x, b[i]))
    }
    return a === b
}

export function isDeepSortedEqual(a: unknown, b: unknown): boolean {
    return isDeepEqual(deepSort(a), deepSort(b))
}
