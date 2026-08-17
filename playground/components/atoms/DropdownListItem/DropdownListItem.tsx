import { DROPDOWN_LIST_ITEM_STATE, type DropdownListItemProps } from "./types"
import type { JSONPrimitive } from "@/types"
import classNames from "classnames"
import { useComponent } from "@/hooks"
import { useEffect } from "react"

import scss from "./dropdown-list-item.module.scss"

export const DropdownListItem = <T extends JSONPrimitive = JSONPrimitive>({
    label,
    value = null,
    selected,
    onSelection,
    onClick,
    className,
    ...props
}: DropdownListItemProps<T>) => {
    const { ref, updateState } = useComponent({
        ...props,
        stateDef: props.stateDef ?? DROPDOWN_LIST_ITEM_STATE,
    })

    useEffect(() => updateState({ selected }), [selected, updateState])

    return (
        <div
            {...props}
            ref={ref}
            className={classNames(scss.dropdownListItem, className)}
            onClick={(ev) => {
                onSelection?.(value === null ? null : { label, value })
                onClick?.(ev)
            }}
        >
            <div className={classNames("rmf-prose", scss.label)}>
                <span>{label}</span>
            </div>
        </div>
    )
}
