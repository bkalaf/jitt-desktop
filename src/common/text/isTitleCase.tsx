import { isUpper } from './isUpper';

export function isTitleCase(str: string) {
    return str.includes(' ') || (!str.includes('-') && !str.includes('_') && isUpper(str[0]));
}
