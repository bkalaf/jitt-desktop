export function objectFilter<T>(obj: Record<string, T> = {}) {
    return function (pred: (x: T) => boolean) {
        return Object.fromEntries(Object.entries(obj).filter((x) => pred(x[1])) ?? []);
    };
}
