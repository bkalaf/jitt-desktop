export function padZero(qty: number) {
    return (n: number) => n.toString().padStart(qty, '0');
}
