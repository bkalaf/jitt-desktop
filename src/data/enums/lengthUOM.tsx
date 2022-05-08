import { isIn } from '../../common/array/isIn';
import { isNotIn } from '../../common/array/isNotIn';

export const lengths = {
    in: 'inches',
    ft: 'feet',
    cm: 'centimeters',
    mm: 'millimeters',
    m: 'meters',
    yd: 'yards',
    mi: 'miles',
    km: 'kilometers'
};

export type LengthUOM = keyof typeof lengths;

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
export function pluralize(str: string) {
    switch (str) {
        case 'child':
            return 'children';
        case 'goose':
            return 'geese';
        case 'man':
            return 'men';
        case 'woman':
            return 'women';
        case 'tooth':
            return 'teeth';
        case 'foot':
            return 'feet';
        case 'mouse':
            return 'mice';
        case 'person':
            return 'people';
        case 'species':
            return 'species';
        case 'series':
            return 'series';
        default:
            if (endsWith(str)('f') && isNotIn(['chef', 'chief', 'belief', 'roof'])(str)) {
                return [str.slice(0, str.length - 1), 'ves'].join('');
            }
            if (endsWith(str)('fe')) {
                return [str.slice(0, str.length - 2), 'ves'].join('');
            }
            if (endsWith(str)('y') && isNotIn(['a', 'e', 'i', 'o', 'u'])(str.substring(str.length - 2, str.length - 1))) {
                return [str.slice(0, str.length - 1), 'ies'].join('');
            }
            if (endsWith(str)('y')) {
                return [str, 's'].join('');
            }
            if (endsWith(str)('o') && isNotIn(['photo', 'piano', 'halo'])(str)) {
                return [str, 'es'].join('');
            }
            if (endsWith(str)('us') && isNotIn(['bus'])(str)) {
                return [str.substring(0, str.length - 2), 'i'].join('');
            }
            if (endsWith(str)('is')) {
                return [str.substring(0, str.length - 2), 'es'].join('');
            }
            if (endsWith(str)('on')) {
                return [str.substring(0, str.length - 2), 'a'].join('');
            }
            if (ifAny(['s', 'ss', 'sh', 'ch', 'x', 'z'])(endsWith)(str)) {
                return [str, 'es'].join('');
            }
            if (isIn(['sheep', 'series', 'species', 'deer', 'fish'])(str)) {
                return str;
            }
            return [str, 's'].join('');
    }
}
