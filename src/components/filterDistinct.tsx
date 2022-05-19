
export function filterDistinct<T>(arr: T[], accum: T[] = []): T[] {
    if (arr.length === 0) { return accum; }
    const [head, ...tail] = arr;
    if (tail.includes(head)) {
        return filterDistinct(tail, [...accum, head]);
    }
    return filterDistinct(tail, accum);
}
