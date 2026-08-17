import { entriesOf, isObj, isString } from "./helpers"
import type { Obj } from "@/types"
import { kebabCase } from "./format"
import { toJson } from "./parse"

export function buildScssMap(obj: Obj, name = "", spaces = 4, indent = 0): string {
    const ind = " ".repeat((indent + 1) * spaces)
    return entriesOf(obj).reduce((x, [k, v]) => {
        const key = /[ ]/u.test(k) ? `"${kebabCase(k)}"` : kebabCase(k)
        if (isObj(v)) {
            return `${x}${ind}${key}: ${buildScssMap(v, "", spaces, indent + 1)},\n`
        }
        const value = isString(v) ? v : toJson(v)
        const quoted = /^[0-9]+\/[0-9]+$/u.test(value)
            ? `"${value}"`
            : value
        return `${x}${ind}${key}: ${quoted},\n`
    }, name ? `$const-${name}: (\n` : "(\n") + " ".repeat(indent * spaces) + (indent ? ")" : ");" + "\n")
}
