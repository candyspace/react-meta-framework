import type { Arr, Falsey, Func, KeyOf, Obj, Primitive } from "@/types"

export function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function arr<T = number>(
    length: number,
    pred: (i: number) => T = i => i as T,
): T[] {
    return Array(length).fill(0).map((_, i) => pred(i))
}

export function keysOf<T extends Obj>(obj: T): (KeyOf<T>)[] {
    return Object.keys(obj)
}

export function valuesOf<T extends Obj>(obj: T): T[keyof T][] {
    return Object.values(obj) as T[keyof T][]
}

export function entriesOf<T extends Obj>(obj: T): [KeyOf<T>, T[KeyOf<T>]][] {
    return Object.entries(obj) as [KeyOf<T>, T[KeyOf<T>]][]
}

export function reduceObj<T extends Obj, R>(
    obj: T,
    pred: (acc: R, value: T[keyof T], key: keyof T, obj: T) => R,
    initialValue: R,
): R {
    return entriesOf(obj).reduce((acc, [key, value]) => pred(acc, value, key, obj), initialValue)
}

export function mapObj<T extends Obj, R>(
    obj: T,
    pred: (value: T[keyof T], key: KeyOf<T>, obj: T) => R,
): Record<keyof T, R> {
    return entriesOf(obj).reduce((acc, [key, value]) => {
        acc[key] = pred(value, key, obj)
        return acc
    }, {} as Record<keyof T, R>)
}

export function isIn<T extends object, K extends string>(
    obj: T | Falsey,
    key: K,
): obj is T & Record<K, unknown> {
    return !!obj && key in obj && obj[key as never] !== undefined
}

export function assert<T>(
    value: T | Falsey,
    message: string,
): asserts value is T {
    if (value) return
    throw new Error(message)
}

export function assertIsIn<T extends object, K extends string>(
    obj: T | Falsey,
    key: K,
    message: string,
): asserts obj is T & Record<K, unknown> {
    if (isIn(obj, key)) return
    throw new Error(message)
}

export function assertIsObj<T extends object>(
    obj: unknown,
    message: string,
): asserts obj is T {
    if (isObj(obj)) return
    throw new Error(message)
}

export function assertIsFunc<R, A extends Arr = []>(
    obj: unknown,
    message: string,
): asserts obj is Func<R, A> {
    if (isFunc(obj)) return
    throw new Error(message)
}

export function isArr<T>(
    value: unknown,
): value is T[] {
    return Array.isArray(value)
}

export function isObj<T = unknown>(
    value: unknown,
): value is Obj<T> {
    return !!value && !isArr(value) && typeof value === "object"
}

export function isFunc<R, A extends Arr = []>(
    value: unknown,
): value is Func<R, A> {
    return typeof value === "function"
}

export function isSymbol(
    value: unknown,
): value is symbol {
    return typeof value === "symbol"
}

export function isPrimitive(
    value: unknown,
): value is Primitive {
    return !isObj(value) && !isArr(value) && !isFunc(value) && !isSymbol(value)
}

export function isString(
    value: unknown,
): value is string {
    return typeof value === "string"
}

export function isNumber(
    value: unknown,
): value is number {
    return typeof value === "number"
}

export function isBool(
    value: unknown,
): value is boolean {
    return typeof value === "boolean"
}
