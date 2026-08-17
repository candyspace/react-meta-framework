import { type ComponentPropsWithRef, type ElementType, type MutableRefObject, type PropsWithChildren, type Ref } from "react"
import type { DEFAULT_COMPONENT_STATE, THEME } from "@/const/state"

export type Key = string | number | symbol
export type Falsey = false | 0 | 0n | "" | null | undefined

export type Obj<T = unknown, K extends Key = string> = Record<K, T>
export type Rec<T = unknown, K extends Key = Key> = Record<K, T>
export type Arr<T = unknown> = T[] | readonly T[]
export type Func<R = unknown, A extends Arr = []> = (...args: A) => R
export type Args<F extends Func> = F extends Func<unknown, infer A> ? A : never
export type Primitive = string | number | boolean | null | undefined | bigint | symbol

export type Maybe<T = null> = T | null | undefined
export type MaybePromise<T = void> = Promise<T> | T
export type MaybeFunc<R, A extends Arr = []> = R | Func<R, A>

export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONValue[] | { [k: string]: JSONValue }
export type JSONArray<T extends JSONValue = JSONValue> = T[]
export type JSONObject<T extends JSONValue = JSONValue> = Obj<T>

export type NestedArr<T = unknown> = T | NestedArr<T>[]
export type NestedObj<T = unknown> = T | { [k: string]: NestedObj<T> }
export type Nested<T = unknown> = T | Nested<T>[] | { [k: string]: Nested<T> }

export type KeyOf<T> = keyof T & string
export type PartialObj<T> = Partial<T> & (T extends Obj<unknown> ? Obj<NonNullable<T[keyof T]>> : {})
export type ConvertEnums<T> = { [K in keyof T]: T[K] extends string | number | undefined ? `${NonNullable<T[K]>}` : T[K] }
export type Mutable<T> = { -readonly [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [key in K]?: Partial<T[key]> }

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
