export function eq<T>(x: T) {
    return function (y: T) {
        return x === y;
    };
}
