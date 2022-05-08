import { capitalize } from './capitalize';
import { decapitalize } from './decapitalize';

export function fromKebabToCamelCase(str: string) {
    return decapitalize(str.split('-').map(capitalize).join(''));
}
