import { isLower } from './isLower';
import { isUpper } from './isUpper';

export function isPascalCase(str: string) {
    return !str.includes('-') && !str.includes('_') && !str.includes(' ') && str.split('').some(isLower) && isUpper(str[0]);
}
