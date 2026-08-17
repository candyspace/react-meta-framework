import { type CanvasMetrics, type Metrics, calculateMetrics, fetchAny, fetchJson, installFontFace, measureText, toUrlParams } from "@/util"
import { useCallback, useRef, useState } from "react"
import { FONT_TEST_CHARACTERS } from "@/const/strings"
import type { Obj } from "@/types"
import { opentypeMetrics } from "~/util/opentype"

export interface FullMetrics {
    family: string
    weight: string
    canvasMixed: CanvasMetrics
    canvasCap: CanvasMetrics
    canvasEx: CanvasMetrics
    fontFace: FontFace
    opentype: opentype.Font
    final: Metrics
}

export interface UseWebFontsOptions {
    onLoadOptions?: (options: {
        familyOptions: { label: string, value: string }[]
        weightOptions: Obj<{ label: string, value: string }[]>
    }) => void
    onLoadMetrics?: (metrics: FullMetrics) => void
}

export function useWebFonts(options?: UseWebFontsOptions) {
    const {
        onLoadOptions,
        onLoadMetrics,
    } = options ?? {}

    const [familyOptions, setFamilyOptions] = useState<{ label: string, value: string }[]>([])
    const [weightOptions, setWeightOptions] = useState<Obj<{ label: string, value: string }[]>>({})
    const [metrics, setMetrics] = useState<Obj<Obj<FullMetrics>>>({})

    const loadOptions = useCallback(async () => {
        const params = toUrlParams({ key: process.env.WEBFONTS_API_KEY })
        const url = `https://www.googleapis.com/webfonts/v1/webfonts${params}`
        const response = await fetchJson("GET", url)
        const json = await response.json() as {
            items: { family: string, variants: string[], files: Obj<string> }[]
        }

        const familyOptions = json.items
            .filter(x => x.variants.some(y => parseInt(y).toString() === y))
            .map(x => ({ label: x.family, value: x.family }))

        const weightOptions = json.items
            .reduce((v, x) => {
                v[x.family] = x.variants
                    .filter(y => parseInt(y).toString() === y)
                    .map(y => ({ label: y, value: `${x.files[y]}` }))
                return v
            }, {} as Obj<{ label: string, value: string }[]>)

        setFamilyOptions(familyOptions)
        setWeightOptions(weightOptions)
        onLoadOptions?.({ familyOptions, weightOptions })

        return {
            familyOptions,
            weightOptions,
        }
    }, [onLoadOptions])

    const isLoading = useRef(false)

    const loadFont = useCallback(async (
        family: string,
        weight: string,
        url: string,
    ) => {
        if (!!metrics[family]?.[weight]) {
            onLoadMetrics?.(metrics[family][weight])
            return metrics[family][weight]
        }
        if (isLoading.current) return

        isLoading.current = true

        const res = await fetchAny("GET", url)
        const buffer = await res.arrayBuffer()
        const fontFace = await installFontFace(buffer, family, weight)
        const canvasOptions = {
            fontFamily: family,
            fontWeight: weight,
            fontStyle: "normal",
            fontSize: 1,
        }
        const canvasMixed = measureText(FONT_TEST_CHARACTERS, canvasOptions)
        const canvasCap = measureText("X", canvasOptions)
        const canvasEx = measureText("x", canvasOptions)
        const opentype = opentypeMetrics(buffer)
        const final = calculateMetrics(opentype, 100)

        const newMetrics: FullMetrics = {
            family,
            weight,
            canvasMixed,
            canvasCap,
            canvasEx,
            fontFace,
            opentype,
            final,
        }

        setMetrics(prev => ({
            ...prev,
            [family]: {
                ...prev[family],
                [weight]: newMetrics,
            },
        }))

        onLoadMetrics?.(newMetrics)

        isLoading.current = false

        return newMetrics
    }, [metrics, onLoadMetrics])

    return {
        loadOptions,
        loadFont,
        familyOptions,
        weightOptions,
        metrics,
    }
}
