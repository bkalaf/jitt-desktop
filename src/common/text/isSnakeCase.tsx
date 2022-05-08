import { isUpper } from './isUpper';

export function isSnakeCase(str: string) {
    return str.includes('_') && str.split('').every((x) => !isUpper(x));
}
