export function isNotNull<T>(x: T | null | undefined): x is NonNullable<T> {
    return x != null;
}

export function isNotNil<T>(x: T | null | undefined): x is NonNullable<T> {
    return isNotNull(x) && (Object.getOwnPropertyNames(x).includes('length') ? (x as any).length > 0 : true);
}
