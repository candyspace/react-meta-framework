export interface TimerOptions {
    values: number[]
}

export function timer(config?: TimerOptions) {
    const {
        values = [Date.now()],
    } = config ?? {}

    const state = {
        values,
        start: () => {
            values.push(Date.now())
            return state
        },
        getLast: () => state.values.length < 2
            ? -1
            : values.at(-1)! - values.at(-2)!,
        getTotal: () => values.length < 2
            ? -1
            : values.at(-1)! - values[0],
    }

    return state
}
