import type { ProjectAnnotations, Renderer } from "storybook/internal/types"
import { useEffect, useMemo } from "react"
import type { ComponentState } from "@/types"
import { STATE_TOOL_ID } from "@/const/state"
import { toJson } from "@/util"

const preview: ProjectAnnotations<Renderer> = {
    decorators: [
        (Story, { globals, canvasElement }) => {
            const canvas = canvasElement as ParentNode

            const data = useMemo(() => globals[STATE_TOOL_ID] as ComponentState ?? {}, [globals])

            useEffect(() => {
                canvas.querySelectorAll("[data-rms]").forEach((el) => {
                    el.setAttribute("data-rms", toJson(data))
                })
            }, [data, canvas])

            return <Story />
        },
    ],
    initialGlobals: {
        [STATE_TOOL_ID]: {},
    },
}

export default preview
