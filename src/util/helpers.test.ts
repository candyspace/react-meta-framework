import { describe, expect, it } from "vitest"
import { isArr, isFunc, isObj, isPrimitive, isSymbol } from "./helpers"

describe("isArr", () => {
    it("should return true for arrays", () => {
        expect(isArr([1, 2, 3])).toBe(true)
    })

    it("should return false for objects", () => {
        expect(isArr({ 0: 1 })).toBe(false)
    })

    it("should return false for strings", () => {
        expect(isArr("test")).toBe(false)
    })

    it("should return false for numbers", () => {
        expect(isArr(123)).toBe(false)
    })

    it("should return false for null", () => {
        expect(isArr(null)).toBe(false)
    })

    it("should return false for undefined", () => {
        expect(isArr(undefined)).toBe(false)
    })

    it("should return false for bigints", () => {
        expect(isArr(123n)).toBe(false)
    })

    it("should return false for functions", () => {
        expect(isArr(() => ({}))).toBe(false)
    })

    it("should return false for symbols", () => {
        expect(isArr(Symbol("test"))).toBe(false)
    })
})

describe("isObj", () => {
    it("should return true for objects", () => {
        expect(isObj({ 0: 1 })).toBe(true)
    })

    it("should return false for arrays", () => {
        expect(isObj([1, 2, 3])).toBe(false)
    })

    it("should return false for strings", () => {
        expect(isObj("test")).toBe(false)
    })

    it("should return false for numbers", () => {
        expect(isObj(123)).toBe(false)
    })

    it("should return false for null", () => {
        expect(isObj(null)).toBe(false)
    })

    it("should return false for undefined", () => {
        expect(isObj(undefined)).toBe(false)
    })

    it("should return false for bigints", () => {
        expect(isObj(123n)).toBe(false)
    })

    it("should return false for functions", () => {
        expect(isObj(() => ({}))).toBe(false)
    })

    it("should return false for symbols", () => {
        expect(isObj(Symbol("test"))).toBe(false)
    })
})

describe("isFunc", () => {
    it("should return true for functions", () => {
        expect(isFunc(() => ({}))).toBe(true)
    })

    it("should return false for objects", () => {
        expect(isFunc({ 0: 1 })).toBe(false)
    })

    it("should return false for arrays", () => {
        expect(isFunc([1, 2, 3])).toBe(false)
    })

    it("should return false for strings", () => {
        expect(isFunc("test")).toBe(false)
    })

    it("should return false for numbers", () => {
        expect(isFunc(123)).toBe(false)
    })

    it("should return false for null", () => {
        expect(isFunc(null)).toBe(false)
    })

    it("should return false for undefined", () => {
        expect(isFunc(undefined)).toBe(false)
    })

    it("should return false for bigints", () => {
        expect(isFunc(123n)).toBe(false)
    })

    it("should return false for symbols", () => {
        expect(isFunc(Symbol("test"))).toBe(false)
    })
})

describe("isSymbol", () => {
    it("should return true for symbols", () => {
        expect(isSymbol(Symbol("test"))).toBe(true)
    })

    it("should return false for objects", () => {
        expect(isSymbol({ 0: 1 })).toBe(false)
    })

    it("should return false for arrays", () => {
        expect(isSymbol([1, 2, 3])).toBe(false)
    })

    it("should return false for strings", () => {
        expect(isSymbol("test")).toBe(false)
    })

    it("should return false for numbers", () => {
        expect(isSymbol(123)).toBe(false)
    })

    it("should return false for null", () => {
        expect(isSymbol(null)).toBe(false)
    })

    it("should return false for undefined", () => {
        expect(isSymbol(undefined)).toBe(false)
    })

    it("should return false for bigints", () => {
        expect(isSymbol(123n)).toBe(false)
    })

    it("should return false for functions", () => {
        expect(isSymbol(() => ({}))).toBe(false)
    })
})

describe("isPrimitive", () => {
    it("should return true for strings", () => {
        expect(isPrimitive("test")).toBe(true)
    })

    it("should return true for numbers", () => {
        expect(isPrimitive(123)).toBe(true)
    })

    it("should return true for booleans", () => {
        expect(isPrimitive(true)).toBe(true)
    })

    it("should return true for null", () => {
        expect(isPrimitive(null)).toBe(true)
    })

    it("should return true for undefined", () => {
        expect(isPrimitive(undefined)).toBe(true)
    })

    it("should return true for bigints", () => {
        expect(isPrimitive(123n)).toBe(true)
    })

    it("should return false for objects", () => {
        expect(isPrimitive({ 0: 1 })).toBe(false)
    })

    it("should return false for arrays", () => {
        expect(isPrimitive([1, 2, 3])).toBe(false)
    })

    it("should return false for functions", () => {
        expect(isPrimitive(() => ({}))).toBe(false)
    })

    it("should return false for symbols", () => {
        expect(isPrimitive(Symbol("test"))).toBe(false)
    })
})
