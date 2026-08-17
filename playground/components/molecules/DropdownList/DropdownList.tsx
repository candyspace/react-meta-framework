import { DROPDOWN_LIST_STATE, type DropdownListProps } from "./types"
import { type KeyboardEvent, useCallback, useEffect, useState } from "react"
import { useComponent, useComponentReturn, useOptionsSearch } from "@/hooks"
import type { JSONPrimitive } from "@/types"
import classNames from "classnames"
import { stringOrJson } from "@/util"

import DropdownListItem from "~/components/DropdownListItem"

import scss from "./dropdown-list.module.scss"

export const DropdownList = <T extends JSONPrimitive = JSONPrimitive>({
    items = [],
    value = null,
    onKeyDown,
    onSelection: _onSelection,
    onSearch,
    className,
    children,
    ...props
}: DropdownListProps<T>) => {
    const { ref } = useComponent({ ...props, stateDef: props.stateDef ?? DROPDOWN_LIST_STATE })
    const { ref: itemRef, refs: itemRefs, updateStates: updateItemStates } = useComponentReturn()

    const [selectedValue, setSelectedValue] = useState<T | null>(value)
    const [highlightedValue, setHighlightedValue] = useState<T | null>(value)

    const onSelection = useCallback((value: { label: string, value: T } | null) => {
        setHighlightedValue(value?.value ?? null)
        setSelectedValue(value?.value ?? null)
        _onSelection?.(value)
    }, [_onSelection])

    const {
        onSearchInput,
    } = useOptionsSearch({
        items,
        getTerms: item => item.label,
        onMatch: (item) => {
            setHighlightedValue(item.value)
            itemRefs.current?.[stringOrJson(item.value)]?.scrollIntoView({
                inline: "center",
                block: "center",
                behavior: "smooth",
            })
        },
        cooldown: 3000,
        onSearch,
    })

    const onKey = useCallback((ev: KeyboardEvent<HTMLDivElement>) => {
        if (["ArrowUp", "ArrowDown"].includes(ev.key)) {
            const index = highlightedValue
                ? Math.max(items.findIndex(x => x.value === highlightedValue), 0)
                : 0
            const offset = ev.key === "ArrowUp" ? -1 : 1
            const value = items[Math.min(Math.max(index + offset, 0), items.length - 1)].value
            setHighlightedValue(value)
            itemRefs.current?.[stringOrJson(value)]?.scrollIntoView({
                inline: "center",
                block: "center",
                behavior: "smooth",
            })
            ev.preventDefault()
        }
        if (ev.key === "Enter") {
            onSelection?.(highlightedValue
                ? {
                    label: items.find(item => item.value === highlightedValue)?.label ?? "",
                    value: highlightedValue,
                }
                : null)
            ev.preventDefault()
        }
        onSearchInput(ev)
        onKeyDown?.(ev)
    }, [onSearchInput, onKeyDown, highlightedValue, items, itemRefs, onSelection])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedValue(value)
        setHighlightedValue(value)
    }, [value])

    useEffect(() => {
        updateItemStates(k => ({ highlighted: k === highlightedValue && k !== selectedValue }))
    }, [highlightedValue, selectedValue, updateItemStates])

    return (
        <div
            {...props}
            ref={ref}
            className={classNames(scss.dropdownList, className)}
            tabIndex={-1}
            onKeyDown={onKey}
        >
            {children ?? items.map(({ value: v, ...props }) => (
                <DropdownListItem
                    {...props}
                    className={classNames(scss.dropdownListItem)}
                    key={stringOrJson(v)}
                    stateRef={x => itemRef(x, stringOrJson(v))}
                    value={v}
                    selected={v === selectedValue}
                    onSelection={onSelection}
                />
            ))}
        </div>
    )
}
