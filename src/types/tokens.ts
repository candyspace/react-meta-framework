import type { Obj } from "./com"

export interface Aspect {
    ratio: string
    unit: string
}

export type Theme = Obj<string>

export interface Font {
    family: string
    weight: string
    style: string
    ascent: number
    capHeight: number
    exHeight: number
    descent: number
    lineGap: number
    size: number
}

export interface Tokens extends Obj {
    aspects: { file: string, data: Obj<Aspect> }
    themes: { file: string, data: Obj<Theme> }
    fonts: { file: string, data: Obj<Font> }
}
