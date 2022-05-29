export function zip<T, U>(list1: T[], list2: U[]): [T, U][] {
    if (list1.length !== list2.length) throw new Error('Length mismatch on zip function');
    if (list1.length === 0) return [];
    const [head1, ...tail1] = list1;
    const [head2, ...tail2] = list2;
    return [[head1, head2], ...zip(tail1, tail2)];
}
