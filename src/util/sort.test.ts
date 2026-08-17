import { describe, expect, it } from "vitest"
import { deepSort } from "./sort"

describe("deepSort", () => {
    it("should sort object keys", () => {
        const obj = { c: 3, a: 1, b: 2 }
        const sortedObj = { a: 1, b: 2, c: 3 }
        expect(deepSort(obj)).toEqual(sortedObj)
    })

    it("should sort nested objects", () => {
        const obj = { b: { c: 3, a: 1 }, a: 2 }
        const sortedObj = { a: 2, b: { a: 1, c: 3 } }
        expect(deepSort(obj)).toEqual(sortedObj)
    })

    it("should sort arrays of objects", () => {
        const arr = [{ b: 2, a: 1 }, { d: 4, c: 3 }]
        const sortedArr = [{ a: 1, b: 2 }, { c: 3, d: 4 }]
        expect(deepSort(arr)).toEqual(sortedArr)
    })

    it("should handle mixed types", () => {
        const mixed = { a: 1, b: [3, 2, { d: 4, c: 5 }], c: { e: 6, f: 7 } }
        const sortedMixed = { a: 1, b: [2, 3, { c: 5, d: 4 }], c: { e: 6, f: 7 } }
        expect(deepSort(mixed)).toEqual(sortedMixed)
    })
})
