
export function isNotNull<T>(x: T | null | undefined): x is NonNullable<T> {
    return x != null;
}
