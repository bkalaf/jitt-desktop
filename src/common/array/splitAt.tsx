export function splitAt<T>(predicate: (x: T) => boolean) {
    function inner(arr: T[], accum: T[][] = [], current: T[] = []): T[][] {
        if (arr.length == 0) return [...accum, current];
        const [h, ...t] = arr;
        if (predicate(h)) {
            return inner(t, [...accum, current], [h]);
        }
        return inner(t, accum, [...current, h]);
    }
    return (arr: T[]) => inner(arr);
}
