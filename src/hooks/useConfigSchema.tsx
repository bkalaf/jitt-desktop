import { useMemo } from 'react';
import useRealm from './useRealm';

export function useConfigSchema() {
    const realm = useRealm();
    return useMemo(() => realm?.schema ?? [], [realm?.schema]);
}
