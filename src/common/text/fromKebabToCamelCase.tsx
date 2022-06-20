import { splitAt } from '../array';
import { capitalize } from './capitalize';
import { decapitalize } from './decapitalize';
import { isUpper } from './isUpper';

export function fromKebabToCamelCase(str: string) {
    return decapitalize(str.split('-').map(capitalize).join(''));
}

export function fromCamelToKebabCase(str: string) {
    return splitAt(isUpper)(str.split(''))
        .map((x) => x.join('').toLowerCase())
        .join('-');
}
