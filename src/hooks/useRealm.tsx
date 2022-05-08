import { useReactiveVar } from '@apollo/client';
import { $realm } from '../components/globals';

export function useRealm() {
    return useReactiveVar($realm);
}
