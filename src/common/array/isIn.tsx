export function isIn<T>(arr: T[]) {
    return function (item: T) {
        return arr.includes(item);
    };
}
