export function determineGridSize(qty: number): [string, string, number] {
    if (qty < 5) return ['grid grid-cols-2', 'col-span-2', 2];
    if (qty < 12) return ['grid grid-cols-3', 'col-span-3', 3];
    if (qty < 20) return ['grid grid-cols-4', 'col-span-4', 4];
    return ['grid grid-cols-5', 'col-span-5', 5];
}
