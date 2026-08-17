// eslint-disable-next-line import-x/no-nodejs-modules
import { resolve } from "path"

export function previewAnnotations(entry = []) {
    return [
        ...entry,
        resolve(import.meta.dirname, "../../dist/addons/state/preview.mjs"),
        resolve(import.meta.dirname, "../../dist/addons/breakpoints/preview.mjs"),
    ]
}

export function managerEntries(entry = []) {
    return [
        ...entry,
        resolve(import.meta.dirname, "../../dist/addons/state/manager.mjs"),
        resolve(import.meta.dirname, "../../dist/addons/breakpoints/manager.mjs"),
    ]
}
