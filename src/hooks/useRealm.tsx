import { useReactiveVar } from '@apollo/client';
import { $realm } from '../components/globals';

export default function useRealm() {
    return useReactiveVar($realm);
}
