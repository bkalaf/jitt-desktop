export function indexSort(a: [any, { index: number } | null], b: [any, { index: number } | null]) {
    if (a[1] == null || b[1] == null) return 0;
    return a[1].index < b[1].index ? -1 : a[1].index === b[1].index ? 0 : 1;
}
