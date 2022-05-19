import { useReactiveVar } from '@apollo/client';
import { $$eventAggregator } from './AdminMenu';

export function useEventAggregator() {
    return useReactiveVar($$eventAggregator);
}
