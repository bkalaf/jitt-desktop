import { not } from '../not';
import { isIn } from './isIn';

export function isNotIn<T>(arr: T[]) {
    return not(isIn(arr));
}
