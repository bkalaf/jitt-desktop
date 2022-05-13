import { useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNavigateAndDrill } from './useNavigateAndDrill';
import { attemptToGetOID } from '../util';

export function useSelectable(): [string[], (item: string) => boolean, (ev: React.MouseEvent<HTMLElement>) => void] {
    const [searchParams, setSearchParams] = useSearchParams();
    const modifySearchParams = useCallback(
        (key: string, value: string | string[]) => {
            const result: Record<string, string | string[]> = {};
            const current = Object.fromEntries(Array.from(searchParams.entries()));
            Object.getOwnPropertyNames(current).map((x) => (result[x] = current[x]));
            delete result[key];
            result[key] = Array.isArray(value) ? value.join('&') : value;
            setSearchParams(result);
        },
        [searchParams, setSearchParams]
    );
    const selected = useMemo(() => Object.fromEntries(Array.from(searchParams.entries())).selected?.split('&') ?? [], [searchParams]);
    const toggleSelected = useCallback(
        (item: string) => {
            if (selected.includes(item)) {
                return modifySearchParams(
                    'selected',
                    selected.filter((x) => x !== item)
                );
            }
            return modifySearchParams('selected', [...selected, item]);
        },
        [modifySearchParams, selected]
    );
    const cb = useRef<NodeJS.Timeout | null>(null);
    const navDrill = useNavigateAndDrill();
    const onClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>) => {
            console.log('onClick', ev);
            const oid = attemptToGetOID(ev.target as HTMLElement) ?? 'n/a';

            if (ev.detail > 2) return;
            if (ev.detail === 2) {
                if (cb.current) clearTimeout(cb.current);
                return navDrill(oid);
            }
            const action = () => {
                if (ev.ctrlKey || ev.shiftKey) {
                    toggleSelected(oid);
                    return Promise.resolve();
                }
                if (selected.includes(oid)) {
                    modifySearchParams('selected', []);
                    return Promise.resolve();
                }
                modifySearchParams('selected', [oid]);
                return Promise.resolve();
            };
            cb.current = setTimeout(() => action().then(() => (cb.current = null)), 450);
        },
        [modifySearchParams, navDrill, selected, toggleSelected]
    );
    const isSelected = useCallback(
        (id: string) => {
            return selected.includes(id);
        },
        [selected]
    );

    return [selected, isSelected, onClick];
}
