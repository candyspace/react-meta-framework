import type { BaseProps, JSONPrimitive } from "@/types"
import { DEFAULT_COMPONENT_STATE } from "@/const/state"
import type { DropdownListItemProps } from "~/components/DropdownListItem"

export const DROPDOWN_STATE = {
    ...DEFAULT_COMPONENT_STATE,
}

export interface DropdownProps<T extends JSONPrimitive = JSONPrimitive> extends BaseProps<"div", never, typeof DROPDOWN_STATE> {
    items?: DropdownListItemProps<T>[]
    value?: T | null
    onSelection?: (item: { label: string, value: T } | null) => void
}
