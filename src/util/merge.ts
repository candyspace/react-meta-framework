import type { Arr, Obj } from "@/types"
import { isArr, isObj } from "./helpers"

export type MergeArr<T extends Arr, U extends Arr> = [...T, ...U]

export function mergeArr<T extends Arr, U extends Arr>(
    target: T,
    source: U,
): MergeArr<T, U> {
    const merged = [...target]
    for (const item of source) {
        if (!merged.includes(item)) {
            merged.push(item)
        }
    }
    return merged as MergeArr<T, U>
}

export type DeepMerge<T, S> = {
    [K in keyof T & keyof S]: S[K] extends Obj
        ? (T[K] extends Obj ? DeepMerge<T[K], S[K]> : S[K])
        : (S[K] extends Arr
            ? (T[K] extends Arr ? MergeArr<T[K], S[K]> : S[K])
            : S[K])
} & {
    [K in Exclude<keyof T, keyof S>]: T[K]
} & {
    [K in Exclude<keyof S, keyof T>]: S[K]
}

export type DeepMergeObj<T, S> = S extends Obj
    ? (T extends Obj ? DeepMerge<T, S> : S)
    : (T extends Obj ? T : S)

export function deepMerge<T, S>(
    target: T,
    source: S,
): DeepMergeObj<T, S> {
    if (!isObj(target)) {
        return source as DeepMergeObj<T, S>
    }

    if (!isObj(source)) {
        return target as DeepMergeObj<T, S>
    }

    const obj: Obj = { ...target }

    for (const key in source) {
        const t = target[key]
        const s = source[key]

        if (!(key in target) || target[key] === undefined) {
            obj[key] = s
            continue
        }

        if (isArr(s)) {
            obj[key] = isArr(t) ? mergeArr(t, s) : s
            continue
        }

        if (isObj(s)) {
            obj[key] = isObj(t) ? deepMerge(t, s) : s
            continue
        }

        obj[key] = s ?? t
    }

    return obj as DeepMergeObj<T, S>
}

export function deepMergeAll<T, S>(...objects: (T | S)[]) {
    return objects.reduce((v, x) => deepMerge(v, x), {})
}
