export function round(
    value: number,
    precision = 0,
): number {
    const factor = 10 ** precision
    return Math.round(value * factor) / factor
}

export function max(
    ...values: number[]
): number {
    return Math.max(...values)
}

export function min(
    ...values: number[]
): number {
    return Math.min(...values)
}

export function clamp(
    value: number,
    minimum: number,
    maximum: number,
): number {
    return max(minimum, min(maximum, value))
}

export function lerp(
    from: number,
    to: number,
    t: number,
): number {
    return from + (to - from) * t
}
