import type { Obj } from "@/types"

export interface ViewportTypes {
    globals: ViewportState
    parameters: ViewportParameters
}

export interface ViewportState extends Viewport {
    isRotated: boolean
    isLocked: boolean
}

export interface ViewportParameters {
    breakpoints?: {
        disable?: boolean
        options: ViewportMap
    }
}

export type ViewportMap = Obj<Viewport>

export interface Viewport {
    name: string
    type: ViewportType
    metrics: ViewportStyles
}

export type ViewportType = "desktop" | "mobile" | "tablet" | "watch" | "other"

export interface ViewportStyles {
    height: string
    width: string
    h: number
    w: number
}

export type DragSide = "none" | "both" | "bottom" | "right"
