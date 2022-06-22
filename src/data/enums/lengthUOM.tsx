
export const lengthUOMS = {
    in: 'inches',
    ft: 'feet',
    cm: 'centimeters',
    mm: 'millimeters',
    m: 'meters',
    yd: 'yards',
    mi: 'miles',
    km: 'kilometers'
};

export type LengthUOMS = keyof typeof lengthUOMS;

export function endsWith(s: string) {
    return function (ending: string) {
        return s.endsWith(ending);
    };
}
export function ifAny<T>(arr: T[]) {
    return function <U>(predicate: (x: U) => (x: T) => boolean) {
        return (s: U) => arr.some(predicate(s));
    };
}

