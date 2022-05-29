import { isNotNil } from '../isNotNull';

export function isString(x: any): x is string {
    if (isNotNil(x)) {
        return typeof x === 'string';
    }
    return false;
}