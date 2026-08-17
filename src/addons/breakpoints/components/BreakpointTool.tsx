import { ActionList, Select } from "storybook/internal/components"
import { BREAKPOINT_ADDON_ID, BREAKPOINT_ELEMENT_ID } from "@/const/state"
import { Dimensions, ViewportControls, ViewportDimensions, iconsMap } from "./atoms"
import type { DragSide, Viewport, ViewportMap, ViewportStyles } from "../types"
import { GrowIcon, TransferIcon, UndoIcon } from "@storybook/icons"
import { ThemeProvider, useTheme } from "storybook/theming"
import { entriesOf, keysOf } from "@/util"
import { extractMetrics, useBreakpoints } from "../useBreakpoints"
import { memo, useCallback, useEffect, useMemo, useRef } from "react"
import { type API } from "storybook/manager-api"
import { NumericInput } from "./NumericInput"

export const BreakpointTool = memo(({ api }: { api: API }) => {
    const dragSide = useRef<DragSide>("none")
    const dragStart = useRef<[number, number] | undefined>(undefined)
    const dragScrollTarget = useRef<Element | null | undefined>(null)

    const $frame = useRef<HTMLDivElement | null>(null)
    const $dragRefX = useRef<HTMLDivElement | null>(null)
    const $dragRefY = useRef<HTMLDivElement | null>(null)
    const $dragRefXY = useRef<HTMLDivElement | null>(null)
    const $widthInput = useRef<HTMLInputElement | null>(null)
    const $heightInput = useRef<HTMLInputElement | null>(null)
    const $wInput = useRef<HTMLInputElement | null>(null)
    const $hInput = useRef<HTMLInputElement | null>(null)

    const updateElements = useCallback((data: ViewportStyles, isDefault: boolean) => {
        if (!$frame.current) return

        const origWInput: HTMLInputElement | null = document.querySelector("[data-size-input=\"width\"]")
        if (origWInput) {
            origWInput.style.display = "none"
            origWInput.value = origWInput.textContent = data.width
        }

        const origHInput: HTMLInputElement | null = document.querySelector("[data-size-input=\"height\"]")
        if (origHInput) {
            origHInput.style.display = "none"
            origHInput.value = origHInput.textContent = data.height
        }

        const origRoot = origWInput?.parentElement?.parentElement?.parentElement?.parentElement
        if (origRoot) {
            origRoot.style.display = "none"
        }

        const origButton: HTMLButtonElement | null = document.querySelector("[aria-label=\"Viewport size\"]")
        if (origButton) {
            origButton.style.display = "none"
        }

        const origWrapper: HTMLDivElement | null = document.querySelector("#storybook-preview-wrapper")
        if (origWrapper) {
            origWrapper.style.overflow = "visible"

            const origParent: HTMLElement | null = origWrapper.parentElement
            if (origParent) {
                origParent.style.overflow = "visible"
            }
        }

        if ($widthInput.current) {
            $widthInput.current.value = $widthInput.current.textContent = data.width
        }
        if ($heightInput.current) {
            $heightInput.current.value = $heightInput.current.textContent = data.height
        }
        if ($wInput.current) {
            $wInput.current.value = $wInput.current.textContent = data.w.toString()
        }
        if ($hInput.current) {
            $hInput.current.value = $hInput.current.textContent = data.h.toString()
        }

        $dragRefX.current?.setAttribute("data-value", data.width)
        $dragRefY.current?.setAttribute("data-value", data.height)

        $frame.current.style.height = data.height
        $frame.current.style.width = data.width
        $frame.current.parentElement!.style.padding = isDefault ? "0" : "0 40px"
        $frame.current.closest("main")!.style.paddingTop = isDefault ? "0" : "40px"
    }, [])

    const theme = useTheme()
    const {
        name,
        width,
        height,
        w,
        h,
        isRotated,
        isLocked,
        isDefault,
        options,
        update,
        resize,
        reset,
        rotate,
        select,
    } = useBreakpoints(api, updateElements)

    useEffect(() => {
        $dragRefX.current = $dragRefX.current ?? document.querySelector("[data-side=\"right\"]")!
        $dragRefY.current = $dragRefY.current ?? document.querySelector("[data-side=\"bottom\"]")!
        $dragRefXY.current = $dragRefXY.current ?? document.querySelector("[data-side=\"both\"]")!

        const onDrag = (e: MouseEvent) => {
            if (!$frame.current || !dragStart.current) return

            const dragSide = $frame.current.getAttribute("data-dragging") as DragSide
            const dragRight = dragSide === "right" || dragSide === "both"
            const dragBottom = dragSide === "bottom" || dragSide === "both"

            const newW = dragRight ? Math.round(Math.max(1, dragStart.current[0] + e.clientX)) : parseInt(width)
            const newH = dragBottom ? Math.round(Math.max(1, dragStart.current[1] + e.clientY)) : parseInt(height)

            if (dragSide === "both") {
                const metrics = extractMetrics({
                    width: `${newW}px`,
                    height: `${newH}px`,
                })

                resize({ width: metrics.width, height: metrics.height, w, h })
            }
            else if (dragRight) {
                const wUnit = parseFloat(width) / w

                resize({
                    width: `${newW}px`,
                    height,
                    w: Math.round(newW / wUnit),
                    h,
                })
            }
            else if (dragBottom) {
                const hUnit = parseFloat(height) / h

                resize({
                    width,
                    height: `${newH}px`,
                    w,
                    h: Math.round(newH / hUnit),
                })
            }
        }

        const onEnd = () => {
            window.removeEventListener("mouseup", onEnd)
            window.removeEventListener("mousemove", onDrag)

            if (!$frame.current || !dragStart.current) return

            dragStart.current = undefined
        }

        const onStart = (e: MouseEvent) => {
            e.preventDefault()

            window.addEventListener("mouseup", onEnd)
            window.addEventListener("mousemove", onDrag)

            dragSide.current = (e.currentTarget as HTMLElement).dataset.side as DragSide

            dragStart.current = [
                ($frame.current?.clientWidth ?? 0) - e.clientX,
                ($frame.current?.clientHeight ?? 0) - e.clientY,
            ]

            dragScrollTarget.current = $frame.current?.querySelector(
                `[data-edge="${dragSide.current}"]`,
            )
        }

        const handles = [$dragRefX.current, $dragRefY.current, $dragRefXY.current]
        handles.forEach(el => el?.addEventListener("mousedown", onStart))

        return () => handles.forEach(el => el?.removeEventListener("mousedown", onStart))
    }, [h, height, resize, w, width])

    const cycle = useCallback((
        viewports: ViewportMap,
        current: string | undefined,
        direction: 1 | -1 = 1,
    ): Viewport => {
        const keys = keysOf(viewports)
        const currentIndex = current ? keys.indexOf(current) : -1
        const key = keys[Math.max(Math.min(currentIndex + direction, keys.length - 1), 0)]
        return viewports[key]
    }, [])

    useEffect(() => {
        void api.setAddonShortcut(BREAKPOINT_ADDON_ID, {
            label: "Next aspect ratio",
            defaultShortcut: ["alt", "B"],
            actionName: "next",
            action: () => {
                update(cycle(options, name, 1))
            },
        })
        void api.setAddonShortcut(BREAKPOINT_ADDON_ID, {
            label: "Previous aspect ratio",
            defaultShortcut: ["alt", "shift", "B"],
            actionName: "previous",
            action: () => {
                update(cycle(options, name, -1))
            },
        })
        void api.setAddonShortcut(BREAKPOINT_ADDON_ID, {
            label: "Reset aspect ratio",
            defaultShortcut: ["alt", "control", "B"],
            actionName: "reset",
            action: () => {
                reset()
            },
        })
    }, [api, cycle, h, height, isRotated, name, options, reset, update, w, width])

    const opts = useMemo(() => entriesOf(options).map(([k, value]) => {
        return {
            value: k,
            title: value.name,
            icon: iconsMap[value.type],
            right: (
                <Dimensions>
                    <span>{value.metrics.w.toString()}</span>
                    <span>&times;</span>
                    <span>{value.metrics.h.toString()}</span>
                </Dimensions>
            ),
        }
    }), [options])

    useEffect(() => {
        if (!$frame.current) {
            $frame.current = document.querySelector("[data-dragging]")!
            return
        }

        updateElements({ width, height, w, h }, isDefault)
    }, [height, width, w, h, api, isDefault, updateElements])

    return (
        <ThemeProvider theme={theme}>
            <Select
                key={BREAKPOINT_ELEMENT_ID}
                options={opts}
                defaultOptions={name}
                onSelect={(selected) => {
                    select(selected as keyof typeof options)
                }}
                onReset={() => {
                    reset()
                }}
                disabled={isLocked}
                resetLabel="Reset aspect ratio"
                tooltip={isLocked ? "Aspect ratio set by story parameters" : "Change aspect ratio"}
                ariaLabel={isLocked ? "Aspect ratio set by story parameters" : "Aspect ratio"}
                ariaDescription="Select an aspect ratio among predefined options for the preview area, or reset to the default aspect ratio."
                icon={<GrowIcon />}
            >
                {name}
            </Select>
            <ViewportControls
                style={{
                    position: "fixed",
                    top: "46px",
                    right: "40px",
                    display: isDefault ? "none" : "flex",
                }}
            >
                <ViewportDimensions>
                    <NumericInput
                        ref={$wInput}
                        aria-label="Aspect X"
                        data-size-input="w"
                        label="Aspect X"
                        before={(
                            <ActionList.Action size="small" readOnly aria-hidden>
                                X
                            </ActionList.Action>
                        )}
                        value={w.toString()}
                        minValue={0}
                        setValue={(value: string) => {
                            resize({ w: parseInt(value) })
                        }}
                    />
                    <ActionList.Button
                        key="aspect-rotate"
                        size="small"
                        padding="small"
                        ariaLabel="Rotate aspect ratio"
                        onClick={() => {
                            rotate()
                        }}
                    >
                        <TransferIcon />
                    </ActionList.Button>
                    <NumericInput
                        ref={$hInput}
                        aria-label="Aspect Y"
                        data-size-input="h"
                        label="Aspect Y"
                        before={(
                            <ActionList.Action size="small" readOnly aria-hidden>
                                Y
                            </ActionList.Action>
                        )}
                        value={h.toString()}
                        minValue={0}
                        setValue={(value: string) => {
                            resize({ h: parseInt(value) })
                        }}
                    />
                    {!(name in options) && (
                        <ActionList.Button
                            key="aspect-restore"
                            size="small"
                            padding="small"
                            ariaLabel="Restore aspect ratio"
                            onClick={() => {
                                select("")
                            }}
                        >
                            <UndoIcon />
                        </ActionList.Button>
                    )}
                </ViewportDimensions>
                <ViewportDimensions>
                    <NumericInput
                        ref={$widthInput}
                        aria-label="Width X"
                        data-size-input="_width"
                        label="Width X"
                        before={(
                            <ActionList.Action size="small" readOnly aria-hidden>
                                W
                            </ActionList.Action>
                        )}
                        value={width.toString()}
                        minValue={0}
                        setValue={(value: string) => {
                            resize({ width: value })
                        }}
                    />
                    <ActionList.Button
                        key="dimensions-rotate"
                        size="small"
                        padding="small"
                        ariaLabel="Rotate dimensions"
                        onClick={() => {
                            rotate()
                        }}
                    >
                        <TransferIcon />
                    </ActionList.Button>
                    <NumericInput
                        ref={$heightInput}
                        aria-label="Height Y"
                        data-size-input="_height"
                        label="Height Y"
                        before={(
                            <ActionList.Action size="small" readOnly aria-hidden>
                                H
                            </ActionList.Action>
                        )}
                        value={height.toString()}
                        minValue={0}
                        setValue={(value: string) => {
                            resize({ height: value })
                        }}
                    />
                    {!(name in options) && (
                        <ActionList.Button
                            key="dimensions-restore"
                            size="small"
                            padding="small"
                            ariaLabel="Restore dimensions"
                            onClick={() => {
                                select("")
                            }}
                        >
                            <UndoIcon />
                        </ActionList.Button>
                    )}
                </ViewportDimensions>
            </ViewportControls>
        </ThemeProvider>
    )
})
