import { not } from '../not';
import { isIn } from './isIn';

export function isNotIn<T>(arr: T[]) {
    return (s: T) => !arr.includes(s);  
}
    