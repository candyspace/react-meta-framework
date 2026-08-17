import { type API, useGlobals, useParameter } from "storybook/manager-api"
import { DEFAULT_METRICS, DEFAULT_VIEWPORT, VIEWPORTS, VIEWPORT_MAX_HEIGHT, VIEWPORT_MAX_WIDTH, VIEWPORT_MIN_HEIGHT, VIEWPORT_MIN_WIDTH } from "./defaults"
import type { ViewportMap, ViewportParameters, ViewportState, ViewportStyles, ViewportType } from "./types"
import { isString, valuesOf } from "@/util"
import { useCallback, useEffect, useMemo } from "react"
import { BREAKPOINT_PARAM_ID } from "@/const/state"

interface UseBreakpointsReturn {
    isRotated: boolean
    isLocked: boolean
    isDefault: boolean
    isCustom: boolean
    options: ViewportMap
    update: (data: Partial<ViewportState>) => void
    resize: ({ width, height, w, h }: Partial<ViewportStyles>) => void
    reset: () => void
    rotate: () => void
    select: (name: keyof ViewportMap | (string & {})) => void
    height: string
    width: string
    h: number
    w: number
    name: string
    type: ViewportType
}

const URL_VALUE_PATTERN = /^([0-9]{1,4})([a-z]{0,4})([-/])([0-9]{1,4})([a-z]{0,4})$/

const mapUnit = (value: string) => {
    return {
        "pct": "%",
        "px": "px",
        "%": "%",
    }[value] ?? "px"
}

const getAspectRatio = (w: number, h: number) => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const divisor = gcd(w, h)
    return [w / divisor, h / divisor]
}

export const extractMetrics = (value?: string | Partial<ViewportStyles>): ViewportStyles => {
    if (!value) return DEFAULT_METRICS

    if (!isString(value)) {
        if (!!value.w && !!value.h) {
            const w = parseInt(value?.width ?? `${value.w * 80}`)
            const h = parseInt(value?.height ?? `${value.h * 80}`)
            const width = `${Math.round((w + h) / (value.w + value.h) * value.w)}px`
            const height = `${Math.round((w + h) / (value.w + value.h) * value.h)}px`

            return {
                width,
                height,
                w: value.w, h: value.h,
            }
        }

        if (value.width && value.height) {
            const [w, h] = getAspectRatio(parseInt(value.width), parseInt(value.height))

            return {
                width: value.width,
                height: value.height,
                w, h,
            }
        }

        return DEFAULT_METRICS
    }

    const [match, vx, ux, div, vy, uy] = URL_VALUE_PATTERN.exec(value) ?? []

    if (!match) return DEFAULT_METRICS

    const x = Math.max(Number(vx), VIEWPORT_MIN_WIDTH)
    const y = Math.max(Number(vy), VIEWPORT_MIN_HEIGHT)

    if (div !== "/") {
        const unitX = mapUnit(ux)
        const unitY = mapUnit(uy)
        const [w, h] = unitX === "px" && unitY === "px"
            ? getAspectRatio(x, y)
            : [0, 0]

        return {
            width: `${x}${unitX}`,
            height: `${y}${unitY}`,
            w,
            h,
        }
    }

    const wUnit = VIEWPORT_MAX_WIDTH / x
    const hUnit = VIEWPORT_MAX_HEIGHT / y
    const unit = Math.min(wUnit, hUnit)

    return {
        width: `${Math.round(x * unit)}`,
        height: `${Math.round(y * unit)}`,
        w: parseInt(vx),
        h: parseInt(vy),
    }
}

const flipMetrics = (metrics: ReturnType<typeof extractMetrics>, rotated = true) => {
    return rotated
        ? {
            width: metrics.height,
            height: metrics.width,
            w: metrics.h,
            h: metrics.w,
        }
        : metrics
}

const parseGlobals = (globals: ViewportState) => {
    const {
        name = DEFAULT_VIEWPORT.name,
        type = DEFAULT_VIEWPORT.type,
        metrics = DEFAULT_VIEWPORT.metrics,
        isRotated = DEFAULT_VIEWPORT.isRotated,
        isLocked = DEFAULT_VIEWPORT.isLocked,
    } = globals ?? {}

    return {
        name,
        type,
        isRotated,
        isLocked,
        metrics: extractMetrics(metrics),
    }
}

export const useBreakpoints = (api: API, onUpdate: (data: UseBreakpointsReturn, isDefault: boolean) => void) => {
    const { options } = useParameter<ViewportParameters["breakpoints"]>(BREAKPOINT_PARAM_ID, {
        disable: false,
        options: VIEWPORTS,
    })!

    const [globals, updateGlobals] = useGlobals()

    const state = globals?.[BREAKPOINT_PARAM_ID] as ViewportState

    const {
        name,
        type,
        isRotated,
        isLocked,
        metrics,
    } = parseGlobals(state)

    const isDefault = useMemo(() => name === "Responsive", [name])

    const update = useCallback((data: Partial<ViewportState>) => {
        updateGlobals({
            [BREAKPOINT_PARAM_ID]: {
                ...state,
                ...data,
            },
        })
        api.updateGlobals({ viewport: { value: "Responsive" } })
    }, [updateGlobals, state, api])

    const resize = useCallback(({ width, height, w, h }: Partial<ViewportStyles>) => {
        const _metrics = flipMetrics(extractMetrics({
            width: width ?? metrics.width,
            height: height ?? metrics.height,
            w: w ?? metrics.w,
            h: h ?? metrics.h,
        }), isRotated)

        const reverseName = valuesOf(options).find(x => x.metrics.width === _metrics.width
          && x.metrics.height === _metrics.height
          && x.metrics.w === _metrics.w
          && x.metrics.h === _metrics.h)?.name

        const viewport = reverseName ? options[reverseName] : {}

        update({ ...viewport, metrics: flipMetrics(_metrics, isRotated) })
    }, [metrics.width, metrics.height, metrics.w, metrics.h, isRotated, options, update])

    const reset = useCallback(() => {
        update(DEFAULT_VIEWPORT)
        api.updateGlobals({ viewport: { value: "" } })
    }, [api, update])

    const rotate = useCallback(() => {
        update({
            metrics: flipMetrics(extractMetrics(state?.metrics)),
            isRotated: !state?.isRotated,
        })
    }, [update, state?.metrics, state?.isRotated])

    const select = useCallback((name: keyof typeof options | (string & {})) => {
        if (name in options) {
            update(options[name])
            return
        }
        reset()
    }, [options, reset, update])

    const isCustom = useMemo(() => {
        const reverseName = valuesOf(options).find(x => x.metrics.width === metrics.width
          && x.metrics.height === metrics.height
          && x.metrics.w === metrics.w
          && x.metrics.h === metrics.h)?.name
        return !reverseName && !isDefault
    }, [isDefault, metrics.h, metrics.height, metrics.w, metrics.width, options])

    const data = useMemo(() => ({
        name,
        type,
        ...metrics,
        isRotated,
        isLocked,
        isDefault,
        isCustom,
        options,
        update,
        resize,
        reset,
        rotate,
        select,
    }), [name, type, metrics, isRotated, isLocked, isDefault, isCustom, options, update, resize, reset, rotate, select])

    useEffect(() => {
        onUpdate(data, isDefault)
    }, [data, isDefault, onUpdate])

    return data
}
