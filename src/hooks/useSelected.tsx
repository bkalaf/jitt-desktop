import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSelected(): string[] {
    const [searchParams] = useSearchParams();
    const selected = useMemo(() => searchParams.get('selected')?.split('&').filter(x => x.length > 0) ?? [], [searchParams]);
    return selected;
}
