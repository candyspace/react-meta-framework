import type { JSONValue, Obj } from "@/types"
import { isPrimitive, isString } from "./helpers"

export function fromJson<T extends JSONValue>(json: string): T {
    return JSON.parse(json) as T
}

export function toJson(json: unknown, space = 0): string {
    return JSON.stringify(json, null, space)
}

export function stringOrJson(data: unknown) {
    return isString(data) ? data : toJson(data)
}

export function toUrlParams(params: Obj): string {
    const set = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && isPrimitive(value)) {
            set.append(key, String(value))
        }
    }
    return `?${set.toString()}`
}

export function fromUrlParams<T extends Obj<string> = Obj<string>>(params: URLSearchParams): T {
    const obj: Obj = {}
    for (const [key, value] of params.entries()) {
        if (value !== undefined && isString(value)) {
            obj[key] = value
        }
    }
    return obj as T
}

export function toBase64(data: JSONValue, defaultValue = "") {
    try {
        return btoa(String.fromCharCode(...new TextEncoder().encode(toJson(data))))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/g, "")
    }
    catch {
        return defaultValue
    }
}

export function fromBase64(data: string, defaultValue = "") {
    try {
        const bin = atob(data
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(data.length + (4 - (data.length % 4)) % 4, "="))
        const bytes = new Uint8Array(bin.length)
        for (let i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i)
        }
        return new TextDecoder().decode(bytes)
    }
    catch {
        return defaultValue
    }
}
