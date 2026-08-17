import { DROPDOWN_STATE, type DropdownProps } from "./types"
import { useComponent, useComponentReturn } from "@/hooks"
import { useEffect, useState } from "react"
import type { JSONPrimitive } from "@/types"
import classNames from "classnames"

import DropdownList from "~/components/DropdownList"

import scss from "./dropdown.module.scss"

export const Dropdown = <T extends JSONPrimitive = JSONPrimitive>({
    items = [],
    value = null,
    onSelection,
    className,
    ...props
}: DropdownProps<T>) => {
    const { ref, state, updateState } = useComponent({
        ...props,
        stateDef: props.stateDef ?? DROPDOWN_STATE,
        onStateChange: (s, k) => {
            if (!s.focusWithin) updateState({ active: false })
            updateButtonState({ disabled: s.disabled })
            updateListState({ active: s.active, focus: s.active, disabled: s.disabled })
            props?.onStateChange?.(s, k)
        },
    })

    const { ref: buttonRef, updateState: updateButtonState } = useComponent({
        onStateChange: ({ disabled }) => updateState({ disabled }),
    })

    const { ref: searchRef } = useComponent()

    const { ref: listRef, updateState: updateListState } = useComponentReturn()

    const [selectedValue, setSelectedValue] = useState<T | null>(value)
    const [term, setTerm] = useState("")

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedValue(value ?? null)
    }, [value])

    return (
        <div
            {...props}
            ref={ref}
            className={classNames(scss.dropdown, className)}
        >
            <div
                ref={searchRef}
                className={classNames("rmf-prose", scss.term)}
            >
                <span>{term}</span>
            </div>
            <button
                ref={buttonRef}
                className={classNames("rmf-prose", scss.button)}
                tabIndex={state.active ? -1 : 0}
                onClick={() => {
                    updateState({ active: !state.active })
                    updateListState({ active: !state.active })
                }}
            >
                <span>
                    {items.find(item => item.value === selectedValue)?.label}
                </span>
            </button>
            <DropdownList
                stateRef={listRef}
                value={selectedValue}
                items={items}
                onSelection={(v) => {
                    setSelectedValue(v?.value ?? null)
                    updateState({ active: false })
                    updateButtonState({ focus: true })
                    onSelection?.(v)
                }}
                onSearch={x => setTerm(x)}
                onKeyDown={(ev) => {
                    if (ev.key !== "Escape") return
                    updateState({ active: false })
                    updateButtonState({ focus: true })
                    ev.preventDefault()
                }}
            />
        </div>
    )
}
