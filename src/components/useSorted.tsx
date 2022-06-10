import { useCallback, useEffect, useRef } from 'react';
import { fst } from '../common';
import { SortDescriptor } from 'realm';
import { useSearchParams } from 'react-router-dom';
import { OpSymbol, readSort, readSelected, ifNilDelete, getSortedDescriptors } from './MainRouter';
import { readFilter } from '../data/definitions/TableHeaderCell';

export function useSorted(
    initial?: SortDescriptor[]
): [getDescriptor: () => SortDescriptor[], toggleSort: (column: string) => void, getSort: (column: string) => 'ASC' | 'DESC' | null] {
    const init = useRef(false);

    const [searchParams, setSearchParams] = useSearchParams();
    // const sort = searchParams
    //     .get('sort')
    //     ?.split('&')
    //     .map((x) => x.split(':') as [string, 'ASC' | 'DESC']);
    // const filter =
    //     searchParams
    //         .get('filter')
    //         ?.split('&')
    //         .map((x) => x.split(':') as FilterTuple) ?? [];
    // const selected =
    const updateQueryString = useCallback(
        (newSort?: [string, string][], newFilter?: [string, OpSymbol, string][], newSelected?: string[]) => {
            const currentSort = readSort(searchParams);
            const currentFilter = readFilter(searchParams);
            const currentSelected = readSelected(searchParams);
            const result = {
                sort: (newSort ?? currentSort).map((x) => x.join(':')).join('&'),
                filter: (newFilter ?? currentFilter).map((x) => x.join(':')).join('&'),
                selected: (newSelected ?? currentSelected).join('&')
            };
            ifNilDelete('sort')(result);
            ifNilDelete('filter')(result);
            ifNilDelete('selected')(result);
            setSearchParams(result);
        },
        [searchParams, setSearchParams]
    );
    useEffect(() => {
        if (!init.current && initial != null) {
            const newSorted = initial.map(([k, v]) => [k, v ? 'DESC' : 'ASC'] as [string, string]);
            updateQueryString(newSorted);
            init.current = true;
        }
    });
    const addSortLevel = useCallback(
        (column: string, desc = true, ...now: any[]) => {
            const dir = desc ? 'DESC' : 'ASC';
            const next = [...now, [column, dir]] as [string, string][];
            updateQueryString(next);
        },
        [updateQueryString]
    );
    const removeSortLevel = useCallback(
        (column: string) => {
            const next = readSort(searchParams).filter((x) => fst(x) !== column);
            updateQueryString(next);
        },
        [searchParams, updateQueryString]
    );
    const toggleSortLevel = useCallback(
        (column: string) => {
            const now = readSort(searchParams);
            const [_, dir] = now.find((x) => fst(x) === column) ?? [];
            const nextDir = dir == null ? 'ASC' : dir === 'ASC' ? 'DESC' : undefined;
            if (nextDir == null) {
                return removeSortLevel(column);
            } else {
                return addSortLevel(column, nextDir == 'DESC', ...readSort(searchParams).filter((x) => fst(x) !== column));
            }
        },
        [addSortLevel, removeSortLevel, searchParams]
    );
    const getSorted = useCallback(() => {
        return getSortedDescriptors(searchParams);
    }, [searchParams]);
    const lookupColumnSort = useCallback(
        (col: string) => {
            const s = readSort(searchParams).find((x) => fst(x) === col);
            return s == null ? null : s[1];
        },
        [searchParams]
    );
    return [getSorted, toggleSortLevel, lookupColumnSort];
}
