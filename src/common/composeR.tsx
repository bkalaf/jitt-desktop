export function composeR<T, U, V>(f: (x: T) => U, g: (x: U) => V) {
    return (item: T) => g(f(item));
}
