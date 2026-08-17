import type { Obj } from "@/types"
import { deepMerge } from "@/util"

const USE_SHARED_STATE = {
    data: {} as Obj,
}

export default function useSharedState<T>(data: T, key = "default") {
    USE_SHARED_STATE.data = deepMerge(USE_SHARED_STATE.data, { [key]: data })
    return USE_SHARED_STATE.data[key] as T
}
