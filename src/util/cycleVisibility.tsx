import { Visibility } from '../types';

export function cycleVisibility(current: Visibility): Visibility {
    switch (current) {
        case 'hidden':
            return 'showing';
        case 'hiding':
            return 'hidden';
        case 'shown':
            return 'hiding';
        case 'showing':
            return 'shown';
    }
}
