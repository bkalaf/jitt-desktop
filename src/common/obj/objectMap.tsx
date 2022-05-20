export function objectMap<T, U>(func: (x: T) => U) {
    return function <K extends string>(obj: Record<K, T>): Record<K, U> {
        return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v as T)])) as Record<K, U>;
    };
}

export function recordMap<T extends string | number | symbol, U, V>(func: (arg: [T, U]) => V, keyFunc: (x: T) => string) {
    return function (obj: Record<T, U>) {
        const result = Object.fromEntries(Object.entries(obj).map(([k, v]) => [keyFunc(k as T), func([k, v] as [T, U])]));
        return result;
    };
}
