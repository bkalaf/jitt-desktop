import { rangeBetween } from './rangeBetween';

export function charRange(start: string, end: string) {
    return rangeBetween(start.charCodeAt(0), end.charCodeAt(0));
}
