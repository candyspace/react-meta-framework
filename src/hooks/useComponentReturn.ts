import type { ComponentState, Maybe, Obj, UseComponentReturn } from "@/types"
import { deepMergeAll, keysOf } from "@/util"
import { useCallback, useRef } from "react"

export default function useComponentReturn<S extends Obj<boolean | undefined> = ComponentState>() {
    const innerRefs = useRef<Obj<Maybe<UseComponentReturn<S>>>>({})
    const refs = useRef<Obj<HTMLElement | SVGElement | null | undefined>>({})
    const state = useRef<ComponentState<S> & Obj<ComponentState<S>>>({})

    const ref = useCallback((data: Maybe<UseComponentReturn<S>>, key = "default") => {
        innerRefs.current[key] = data
        refs.current[key] = data?.refs.current?.default
        state.current = deepMergeAll(
            state.current,
            innerRefs.current.default?.state,
            { [key]: data?.state ?? {} } as ComponentState<S>,
        )
    }, [])

    const updateState = useCallback((patch: Partial<ComponentState<S>>, key = "default") => {
        innerRefs.current[key]?.updateState(patch)
    }, [innerRefs])

    const updateStates = useCallback((patch: (key: string) => Partial<ComponentState<S>>) => {
        keysOf(innerRefs.current).forEach(k => innerRefs.current[k]?.updateState(patch(k)))
    }, [innerRefs])

    return {
        ref,
        refs,
        state,
        updateState,
        updateStates,
    }
}
