import { type API, useGlobals } from "storybook/manager-api"
import { DEFAULT_COMPONENT_STATE, STATE_ADDON_ID, STATE_TOOL_ID } from "@/const/state"
import { entriesOf, keysOf } from "@/util"
import { memo, useCallback, useEffect, useMemo } from "react"
import { ButtonIcon } from "@storybook/icons"
import type { ComponentState } from "@/types"
import { Select } from "storybook/internal/components"

export const StateTool = memo(({ api }: { api: API }) => {
    const [globals, updateGlobals] = useGlobals()

    const data = useMemo(() => globals[STATE_TOOL_ID] as ComponentState ?? {}, [globals])
    const options = useMemo(() => keysOf(DEFAULT_COMPONENT_STATE)
        .map(k => ({ title: k, value: k })), [])

    const updateState = useCallback((state: Partial<ComponentState> = {}) => {
        updateGlobals({ [STATE_TOOL_ID]: state })
    }, [updateGlobals])

    useEffect(() => {
        void api.setAddonShortcut(STATE_ADDON_ID, {
            label: "Meta States",
            defaultShortcut: ["alt", "M"],
            actionName: "outline",
            showInMenu: true,
            action: () => updateState({}),
        })
    }, [api, updateState])

    return (
        <Select
            key={STATE_TOOL_ID}
            resetLabel="Reset meta states"
            onReset={updateState}
            icon={<ButtonIcon />}
            ariaLabel="Meta States"
            tooltip="Apply meta states"
            options={options}
            value={keysOf(data).filter(x => !!data[x])}
            multiSelect
            onChange={(selected) => {
                updateState(entriesOf(DEFAULT_COMPONENT_STATE).reduce((v, [k]) => ({ ...v, [k]: selected.includes(k) }), {}))
            }}
        />
    )
})
