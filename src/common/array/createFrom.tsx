export function createFrom<T>(func: () => T, qty: number): T[] {
    if (qty === 0) return [];
    return [func(), ...createFrom(func, qty - 1)];
}
