import type { BaseProps, JSONPrimitive } from "@/types"
import { DEFAULT_COMPONENT_STATE } from "@/const/state"
import type { DropdownListItemProps } from "~/components/DropdownListItem"

export const DROPDOWN_LIST_STATE = {
    ...DEFAULT_COMPONENT_STATE,
}

export interface DropdownListProps<T extends JSONPrimitive = JSONPrimitive> extends BaseProps<"div", "onChange", typeof DROPDOWN_LIST_STATE> {
    items?: DropdownListItemProps<T>[]
    value?: T | null
    onSelection?: (value: { label: string, value: T } | null) => void
    onSearch?: (term: string) => void
}
