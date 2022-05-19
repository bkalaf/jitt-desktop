import { useRealm } from './useRealm';

export function useLocalRealm() {
    const realm = useRealm();
    if (!realm) throw new Error('useLocalRealm called: no realm');
    return realm;
}
