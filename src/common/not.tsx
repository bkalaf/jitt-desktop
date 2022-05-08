export function not<T>(predicate: (x: T) => boolean) {
    return (item: T) => !predicate(item);
}
