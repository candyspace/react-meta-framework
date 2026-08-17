import type { FontFaceConfig, FontMetricsConfig, FontTypeConfig } from "@/types/components"
import type { CSSProperties } from "react"
import type { Font } from "opentype.js"
import { round } from "./math"

export interface CanvasMetrics {
    size: number
    height: number
    ascent: number
    descent: number
    modifier: number
}

export interface FullCanvasMetrics extends CanvasMetrics {
    heightActual: number
    ascentActual: number
    descentActual: number
    modifierActual: number
}

export interface Metrics {
    ascent: number
    capHeight: number
    exHeight: number
    descent: number
    lineGap: number
    size: number
}

export function measureText(text: string, options: {
    fontFamily: string
    fontWeight: string
    fontStyle: string

    fontSize: number
    letterSpacing?: number
}) {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    const {
        fontFamily,
        fontWeight,
        fontStyle = "normal",
        fontSize,
        letterSpacing = 0,
    } = options

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px '${fontFamily}'`
    ctx.letterSpacing = `${letterSpacing}px`

    const metrics = ctx.measureText(text)

    canvas.remove()

    return {
        width: round(metrics.width, 6),
        size: 100,
        height: round((metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent), 6),
        ascent: round(metrics.fontBoundingBoxAscent, 6),
        descent: round(metrics.fontBoundingBoxDescent, 6),
        modifier: round((metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent) / 100, 6),
        heightActual: round((metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent), 6),
        ascentActual: round(metrics.actualBoundingBoxAscent, 6),
        descentActual: round(metrics.actualBoundingBoxDescent, 6),
        modifierActual: round((metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / 100, 6),
    }
}

export async function installFontFace(
    buffer: ArrayBuffer,
    family: string,
    weight: string,
) {
    const fontFace = new FontFace(family, buffer, { weight })
    await fontFace.load()
    document.fonts.add(fontFace)
    return fontFace
}

export function calculateMetrics(opentype: Font, fontSize: number): Metrics {
    const {
        tables: { hhea, os2 },
        unitsPerEm,
    } = opentype

    const metrics: Metrics = {
        ascent: round(hhea.ascender / unitsPerEm * fontSize, 6),
        capHeight: round((os2?.sCapHeight ?? hhea.ascender) / unitsPerEm * fontSize, 6),
        exHeight: round((os2?.sxHeight ?? os2?.sCapHeight ?? hhea.ascender) / unitsPerEm * fontSize, 6),
        descent: round(-hhea.descender / unitsPerEm * fontSize, 6),
        lineGap: round((hhea.lineGap ?? 0) / unitsPerEm * fontSize, 6),
        size: round(fontSize, 6),
    }

    return metrics
}

export function fontFaceStyles(data?: Partial<FontFaceConfig>) {
    return {
        "--font-family": data?.fontFamily ?? "\"Open Sans\", sans-serif",
        "--font-weight": data?.fontWeight ?? 600,
        "--font-style": data?.fontStyle ?? "normal",
    } as CSSProperties
}

export function fontMetricsStyles(data?: Partial<FontMetricsConfig>) {
    return {
        "--fm-ascent": round(data?.ascent ?? 106.884766, 6),
        "--fm-cap-height": round(data?.capHeight ?? 71.386719, 6),
        "--fm-ex-height": round(data?.exHeight ?? 53.515625, 6),
        "--fm-descent": round(data?.descent ?? 29.296875, 6),
        "--fm-line-gap": round(data?.lineGap ?? 0, 6),
        "--fm-size": round(data?.size ?? 100, 6),
    } as CSSProperties
}

export function fontTypeStyles(data?: Partial<FontTypeConfig>) {
    return {
        "--font-size": round(data?.fontSize ?? 4, 6),
        "--font-spacing": round(data?.letterSpacing ?? 0, 6),
        "--font-line-height": round(data?.lineHeight ?? 1, 6),
        "--font-unit": data?.fontUnit ?? "var(--font-unit, var(--aspect-unit, 2lvh))",
    } as CSSProperties
}
