import React, { useCallback, useMemo, useRef } from 'react';
import { useProvideDeleteCommand } from '../../hooks/useProvideDeleteCommand';
import { useDeleteCommand } from '../../hooks/useDeleteCommand';
import { checkForOID } from './checkForOID';
import { useSearch } from './useSearch';
import { useNavigateDown } from '../../hooks/useNavigateDown';

export function useProvideViewContext() {
    return [];
}
export function useSelection() {
    // TODO set sorts for column header
    useProvideDeleteCommand();
    const manageParam = useSearch();
    const {
        get: selected,
        toggle: toggleSelected,
        clear: clearSelected,
        set: setSingleSelected,
        remove: removeSelected,
        append: appendSelected
    } = useMemo(() => manageParam('selected'), [manageParam]);
    const { get: sortAsc, clear: clearSortAsc, set: setSingleSortAsc, append: appendAsc } = manageParam('asc');
    const { get: sortDesc, remove: removeSortDesc, clear: clearSortDesc, set: setSingleSortDesc, append: appendDesc } = manageParam('desc');
    const addSort = useCallback(
        (colName: string, descending = false) => {
            if (descending) {
                return appendDesc(colName);
            } else {
                return appendAsc(colName);
            }
        },
        [appendAsc, appendDesc]
    );
    const toggleSort = useCallback(
        (colName: string) => {
            if (sortAsc().includes(colName)) {
                addSort(colName, true);
            } else if (sortDesc().includes(colName)) {
                removeSortDesc(colName);
            } else {
                addSort(colName, false);
            }
        },
        [addSort, removeSortDesc, sortAsc, sortDesc]
    );
    const cb = useRef<NodeJS.Timeout | null>(null);
    const navigateToId = useNavigateDown();
    const isSelected = useCallback(
        (oid: string) => {
            return selected().includes(oid);
        },
        [selected]
    );
    const onClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>) => {
            console.log('on-click', ev);
            alert(ev);
            const oid = checkForOID(ev.target as HTMLElement);
            if (ev.detail > 2) {
                return;
            } else if (ev.detail === 2) {
                if (cb.current) clearTimeout(cb.current);
                navigateToId(oid ?? 'unknown');
            } else {
                if (cb.current) return;
                const action = () => {
                    if (oid == null) throw new Error('attempting to set selected: oid not found');
                    if (ev.ctrlKey || ev.shiftKey) {
                        if (isSelected(oid)) {
                            return removeSelected(oid);
                        }
                        return appendSelected(oid);
                    } else {
                        if (isSelected(oid)) {
                            clearSelected();
                        } else {
                            setSingleSelected(oid);
                        }
                    }
                };
                cb.current = setTimeout(action, 400);
            }
        },
        [appendSelected, clearSelected, isSelected, navigateToId, removeSelected, setSingleSelected]
    );
    const deleteCommand = useDeleteCommand();
    const onDeleteClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>) => {
            if (deleteCommand.disabled) return;
            deleteCommand.execute();
        },
        [deleteCommand]
    );
    const onSelectClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>) => {
            const oid = checkForOID(ev.target as HTMLElement);
            if (oid == null) throw new Error('cannot set selected: oid not found');
            toggleSelected(oid);
        },
        [toggleSelected]
    );
    return {
        tr: {
            isSelected,
            onClick,
            deleteEnabled: isSelected
        },
        td: {
            onSelectClick,
            onDeleteClick
        }
    };
}
