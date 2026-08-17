import type { Aspect, Font, Obj, Theme, Tokens } from "@/types"

export const aspects = {
    narrow: {
        ratio: "9/64",
        unit: "1lvh",
    },
    square: {
        ratio: "2/3",
        unit: "1lvh",
    },
    wide: {
        ratio: "4/3",
        unit: "1lvh",
    },
} as const satisfies Obj<Aspect>

export const themes = {
    light: {
        bgIdle: "#ddd",
        bgSelected: "#bbb",
        bgPressed: "#aaa",
        bgHighlighted: "#888",
        bgDisabled: "#666",
        shadowActive: "#000",
        fgIdle: "#444",
        fgHover: "#000",
        fgInverse: "#ccc",
        borderFocusWithin: "#0a0",
        outlineFocus: "#a00",
        fgError: "#a00",
        accent1: "#f00",
        accent2: "#ff0",
        accent3: "#0f0",
        accent4: "#00f",
        accent5: "#f0f",
    },
    dark: {
        bgIdle: "#111",
        bgSelected: "#222",
        bgPressed: "#333",
        bgHighlighted: "#444",
        bgDisabled: "#000",
        shadowActive: "#fff",
        fgIdle: "#aaa",
        fgHover: "#fff",
        fgInverse: "#333",
        borderFocusWithin: "#0aa",
        outlineFocus: "#0aa",
        fgError: "#a00",
        accent1: "#f00",
        accent2: "#ff0",
        accent3: "#0f0",
        accent4: "#00f",
        accent5: "#f0f",
    },
    cyncly: {
        bgStone: "#f9f6f4",
        bgBlue: "#292bff",
        bgBlueHover: "#0002d6",
        borderLight: "#ebe6e7",
        textPrimary: "#000000",
        textInverse: "#ffffff",
        bgShadow: "#00000033",
        outlineFocus: "#292bff",
    },
} as const satisfies Obj<Theme>

export const fonts = {
    OpenSansBold: {
        family: "Open Sans",
        weight: "600",
        style: "normal",
        ascent: 106.884766,
        capHeight: 71.386719,
        exHeight: 53.515625,
        descent: 29.296875,
        lineGap: 0,
        size: 100,
    },
} as const satisfies Obj<Font>

export function unit(value: number) {
    return `calc(var(--aspect-unit) * ${value})`
}

export default {
    aspects: { file: "aspect", data: aspects },
    themes: { file: "theme", data: themes },
    fonts: { file: "type", data: fonts },
} as const satisfies Tokens
