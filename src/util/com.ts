import type { KeyOf, Obj } from "@/types"
import { entriesOf } from "./helpers"

export function fromEntries<T extends Obj>(entries: [KeyOf<T>, T[KeyOf<T>]][]): T {
    return Object.fromEntries(entries) as T
}

export function filterObj<T extends Obj>(
    obj: T,
    keys: readonly (KeyOf<T> & (string | {}))[],
    exclusive = false,
): Omit<T, typeof keys[number]> {
    return fromEntries(entriesOf(obj).filter(([k]) => exclusive ? !keys.includes(k) : keys.includes(k)))
}
