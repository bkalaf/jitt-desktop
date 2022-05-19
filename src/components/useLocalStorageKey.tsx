import { useMemo } from 'react';

export function useLocalStorageKey(...segments: string[]) {
    return useMemo(() => segments.join('::'), [segments]);
}
