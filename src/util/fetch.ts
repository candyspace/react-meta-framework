import { deepMerge } from "./merge"

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export function fetchJson(
    method: RequestMethod,
    url: string,
    options: RequestInit = {},
) {
    return fetch(url, deepMerge({
        method,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    }, options))
}

export function fetchAny(
    method: RequestMethod,
    url: string,
    options: RequestInit = {},
) {
    return fetch(url, deepMerge({
        method,
    }, options))
}
