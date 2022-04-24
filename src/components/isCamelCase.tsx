import { isLower } from './isLower';

export function isCamelCase(str: string) {
    return !str.includes('-') && !str.includes('_') && !str.includes(' ') && str.split('').some(isLower) && isLower(str[0]);
}
