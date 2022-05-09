import { useCallback, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { distinct } from '../common/array/distinct';
import { objEq } from '../components/grid/objEq';
import { balanceState } from '../components/grid/balanceState';

/* : (
    key: string
) => [
    append: (value: string) => void,
    remove: (value: string) => void,
    clear: () => void,
    set: (value: string) => void,
    toggle: (value: string) => void,
    get: () => string[]
]
*/
export function useSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const currentSearch = useRef(Object.fromEntries(Array.from(searchParams.entries()).map(([k, v]) => [k, v.split('&')])));
    const modifySearch = useCallback(
        (next: Record<string, string[]>, key: string, value: string, op: string) => {
            if (objEq(currentSearch.current, next)) return;
            currentSearch.current = next;
            setSearchParams(Object.fromEntries(Object.entries(next).map(([k, v]) => [k, v.join('&')])), {
                state: balanceState([...((location.state as any[]) ?? [op, key, value]), []])
            });
        },
        [location.state, setSearchParams]
    );
    const clearKey = useCallback(
        (key: string) => {
            const next = { ...currentSearch.current };
            delete next[key];
            modifySearch(next, key, '', 'Clear');
        },
        [modifySearch]
    );
    const setKey = useCallback(
        (key: string, value: string | string[]) => {
            const next = { ...currentSearch.current };
            next[key] = Array.isArray(value) ? value : [value];
            if (!objEq(next, currentSearch)) modifySearch(next, key, value.toString(), 'Set');
        },
        [modifySearch]
    );
    const appendToKey = useCallback(
        (key: string, value: string) => {
            const next = { ...currentSearch.current };
            const c = next[key];
            next[key] = distinct([...c, value]);
            modifySearch(next, key, value, 'Append');
        },
        [modifySearch]
    );
    const deleteFromKey = useCallback(
        (key: string, value: string) => {
            const next = { ...currentSearch.current };
            const c = next[key];
            next[key] = c.filter((x) => x !== value);
            if (!objEq(next, currentSearch)) modifySearch(next, key, value, 'Delete');
        },
        [modifySearch]
    );
    const toggleFromKey = useCallback(
        (key: string, value: string) => {
            const next = { ...currentSearch.current };
            const c = next[key];
            if (c.includes(value)) {
                deleteFromKey(key, value);
            } else {
                appendToKey(key, value);
            }
        },
        [appendToKey, deleteFromKey]
    );

    const manageParam = useCallback(
        (key: string) => ({
            append: (value: string) => appendToKey(key, value),
            remove: (value: string) => deleteFromKey(key, value),
            clear: () => clearKey(key),
            set: (value: string) => setKey(key, value),
            toggle: (value: string) => toggleFromKey(key, value),
            get: () => (currentSearch.current ?? {})[key] ?? []
        }),
        [appendToKey, clearKey, deleteFromKey, setKey, toggleFromKey]
    );

    return manageParam;
}
