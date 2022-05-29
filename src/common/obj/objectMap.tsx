export function objectMap<T, U>(func: (x: T) => U) {
    return function <K extends string>(obj: Record<K, T>): Record<K, U> {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v as T)])) as Record<K, U>;
    };
}
