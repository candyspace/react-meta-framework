import { describe, expect, it } from "vitest"
import { deepMerge } from "./merge"

describe("deepMerge", () => {
    it("should merge two objects deeply", () => {
        const obj1 = { a: 1, b: { c: 2 } }
        const obj2 = { b: { d: 3 }, e: 4 }
        const result = deepMerge(obj1, obj2)

        expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 })
    })

    it("should handle nested arrays", () => {
        const obj1 = { a: [1, 2], b: { c: [3, 4] } }
        const obj2 = { b: { c: [5] }, d: [6] }
        const result = deepMerge(obj1, obj2)

        expect(result).toEqual({ a: [1, 2], b: { c: [3, 4, 5] }, d: [6] })
    })

    it("should handle empty objects", () => {
        const obj1 = {}
        const obj2 = { a: 1 }
        const result = deepMerge(obj1, obj2)

        expect(result).toEqual({ a: 1 })
    })

    it("should handle overriden types", () => {
        const obj1 = { a: { b: 1 }, b: 2 }
        const obj2 = { a: [1] }
        const result = deepMerge(obj1, obj2)

        expect(result).toEqual({ a: [1], b: 2 })
    })
})
