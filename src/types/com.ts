import { type ComponentPropsWithRef, type ElementType, type MutableRefObject, type PropsWithChildren, type Ref } from "react"
import type { DEFAULT_COMPONENT_STATE, THEME } from "@/const/state"
import type { KeyOf, Maybe, Obj } from "@cjaye/utils"

export type ComponentStateFull = Record<KeyOf<typeof DEFAULT_COMPONENT_STATE> | (string & {}), boolean | undefined>
export type ComponentStatePartial = Partial<ComponentStateFull>
export type ComponentState<S extends ComponentStatePartial = ComponentStatePartial> = Partial<Record<KeyOf<S>, boolean | undefined>>

export interface ComponentStateProps<
    S extends ComponentStatePartial = ComponentStateFull,
    E extends Ref<HTMLElement> = Ref<HTMLElement>,
> {
    ref?: E
    stateRef?: (data: Maybe<UseComponentReturn<S>>, key?: string) => void
    stateDef?: ComponentState<S>
    stateForce?: ComponentState<S>
    stateUseTouch?: boolean
    onStateChange?: (state: ComponentState<S>, key?: string) => void
}

export interface UseComponentReturn<S extends ComponentStatePartial = ComponentStateFull> {
    ref: (node: HTMLElement | SVGElement | null, key?: string) => void
    refs: MutableRefObject<Obj<Maybe<HTMLElement | SVGElement>>>
    state: ComponentState<S>
    updateState: (patch: ComponentState<S>, key?: string) => void
    updateStates: (patch: (key: string) => ComponentState<S>) => void
}

export interface UseComponentReturnReturn<S extends ComponentStatePartial = ComponentStateFull> {
    ref: (data: Maybe<UseComponentReturn<S>>, key?: string) => void
    refs: MutableRefObject<Obj<Maybe<HTMLElement | SVGElement>>>
    state: MutableRefObject<ComponentState<S> & Obj<ComponentState<S>>>
    updateState: (patch: ComponentState<S>, key?: string) => void
    updateStates: (patch: (key: string) => ComponentState<S>) => void
}

export type BaseProps<
    T = ElementType,
    O extends keyof (T extends ElementType
        ? ComponentPropsWithRef<T>
        : PropsWithChildren<T>
    ) = never,
    S extends ComponentState = {},
> = {
    "data-theme"?: `${typeof THEME[keyof typeof THEME]}`
} & Omit<
    (T extends ElementType
        ? ComponentPropsWithRef<T>
        : PropsWithChildren<T>
    ), O> & (S extends never
        ? {}
        : ComponentStateProps<
            S,
            T extends ElementType
                ? ComponentPropsWithRef<T>["ref"]
                : Ref<HTMLElement>>
        )
