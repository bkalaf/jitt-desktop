export function partitionBy<T>(predicate: (x: T) => boolean) {
    function inner(arr: T[], tAcc: T[] = [], fAcc: T[] = []): [T[], T[]] {
        if (arr.length === 0) return [tAcc, fAcc];
        const [head, ...tail] = arr;
        if (predicate(head)) {
            return inner(tail, [...tAcc, head], fAcc);
        }
        return inner(tail, tAcc, [...fAcc, head]);
    }
    return inner;
}
