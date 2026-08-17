export async function wait(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms))
}

export async function asyncFor<T>(
    arr: T[],
    pred: (item: T, i: number, arr: T[]) => Promise<void>,
): Promise<void> {
    for (let i = 0; i < arr.length; i++) {
        await pred(arr[i], i, arr)
    }
}

export async function asyncFilter<T>(
    arr: T[],
    pred: (item: T, i: number, arr: T[]) => Promise<boolean>,
): Promise<T[]> {
    const results: T[] = []
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (await pred(item, i, arr)) {
            results.push(item)
        }
    }
    return results
}
