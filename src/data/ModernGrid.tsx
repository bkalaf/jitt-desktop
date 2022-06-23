import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { ObjectId } from 'bson';
import { useToggle } from '../hooks/useToggle';
import { Pagination } from './Pagination';
import { IViewProps } from './TypeLookup';
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { usePagination } from '../hooks/usePagination';
import { PaginationControls } from './PaginationControls';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { DuotoneIcon } from '../components/icons/DuotoneIcon';
import { getLetterIcon } from './getLetterIcon';
import { useSelectable } from '../hooks/useSelectable';
import { rangeBetween } from '../common/array/rangeBetween';
import { matchPath } from 'react-router';
import { app, BrowserWindow, dialog } from '@electron/remote';
import { getCurrentWindow, getCurrentWebContents, getGlobal, getBuiltin } from '@electron/remote/renderer';
import { useLog } from '../hooks/useLog';
import useLocalRealm from '../hooks/useLocalRealm';
import { useElementRef } from '../hooks/useForm';
import { useToast } from '../hooks/useToast';
import { useSorted } from '../components/useSorted';
import useRealm from '../hooks/useRealm';

export function useOnMount(func: () => void) {
    console.log(`ONMOUNT`, func.name);
    useEffect(() => {
        func();
    }, [func]);
}
export function useOnUnmount(func: () => void) {
    console.log(`ONUNMOUNT`, func.name);

    useEffect(() => {
        return () => func();
    }, [func]);
}
export function useDebounce<T>(value: T, delay = 1000) {
    const [state, setState] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setState(value), delay);
        return () => clearTimeout(handler);
    }, [delay, value]);
    return state;
}
export function useDebouncedCallback<T extends any[], U>(func: (...args: T) => U, delay = 1000) {
    const timeout = useRef<NodeJS.Timeout | null>(null);
    return useCallback(
        (...args: T) => {
            const later = () => {
                if (timeout.current != null) {
                    clearTimeout(timeout.current);
                }
                func(...args);
            };
            if (timeout.current) clearTimeout(timeout.current);
            timeout.current = setTimeout(later, delay);
        },
        [delay, func]
    );
}
export function useThrottleCallback<T extends any[], U>(func: (...args: T) => U, delay = 500) {
    const token = useRef<NodeJS.Timeout | null>(null);
    const [value, setValue] = useState<U | undefined>();
    const throttledFunc = useCallback(
        (...args: T) => {
            if (token.current) return value;
            setValue(func(...args));
            token.current = setTimeout(() => (token.current = null), delay);
            return value;
        },
        [delay, func, value]
    );
    return throttledFunc;
}

export function useEditable() {
    const formRef = useElementRef<HTMLFormElement>();
    const [editableRow, setEditableRow] = useState<string | undefined>(undefined);
    const realm = useLocalRealm();
    const isEditable = useCallback(() => editableRow != null, [editableRow]);
    const memoizedData = useRef<any>(undefined);
    const successToast = useToast('success');
    const failureToast = useToast('failure');
    const webContents = getCurrentWebContents();
    const log = useLog();
    webContents.on('did-frame-navigate', () => log('did-frame-navigate'));
    webContents.on('did-navigate-in-page', () => log('navigate-in-page'));

    const confirmDialog = useCallback(() => {
        const result = dialog.showMessageBox(getCurrentWindow(), {
            message: `Do you want to save the changes to the following columns: ${dirtyColumns.join(', ')}?`,
            title: 'Confirm Save',
            buttons: ['SAVE CHANGES', 'DISCARD CHANGES', 'CANCEL'],
            type: 'question'
        });
        result.then((id) => {
            switch (id.response) {
                case 0: {
                    realm.write(() => {
                        const func = (n: string) => (memoizedData.current[n] = (formRef.current?.elements.namedItem(n) as DataElement).value);
                        dirtyColumns.forEach(func);
                    });
                    successToast(`Successfully updated: ${dirtyColumns.join('; ')}.`, 'UPDATED', `Modified ${dirtyColumns.length} columns.`);
                    setDirtyColumns([]);
                    setEditableRow(undefined);
                    return;
                }
                case 1: {
                    setEditableRow(undefined);
                    dirtyColumns.forEach((n) => {
                        if (!formRef.current) throw new Error('no ref');
                        const el = formRef.current.elements.namedItem(n) as DataElement;
                        if (!el) throw new Error('bad name');
                        el.value = memoizedData.current[n];
                    });
                    setDirtyColumns([]);
                    return;
                }
                case 2: {
                    return;
                }

                default:
                    break;
            }
        });
    }, []);
    const toggleEditable = useCallback((item: string, data: any) => {
        setEditableRow((prev) => {
            if (prev === item) {
                memoizedData.current = null;
                return undefined;
            }
        });
    }, []);
    const [dirtyColumns, setDirtyColumns] = useState<string[]>([]);
    const markDirty = useCallback((item: string) => {
        setDirtyColumns((prev) => (prev.includes(item) ? prev : [...prev, item]));
    }, []);
}
export function ModernGrid<T extends { _id: ObjectId } = { _id: ObjectId }>(props: IViewProps) {
    const isInit = useRef(false);
    const realm = useLocalRealm();
    const { HeaderComponent, ImmutableRowComponent, MutableRowComponent, InsertControlsComponent, EditControlsComponent, Definitions, data, columnList, sort } =
        props;
    const [collection] = useRoutedCollection(true);
    const [editableRow, setEditableRow] = useState<string | undefined>(undefined);
    const [resultsPerPage, setResultsPerPage, maxIndex, maxPage, setPage, start, end, pageStats, page, setEffective, effective] = usePagination(data());
    const canGoNext = useCallback(() => {
        return page < maxPage;
    }, [maxPage, page]);
    const canGoPrevious = useCallback(() => {
        return page > 1;
    }, [page]);
    const goPrevious = useCallback(() => {
        setPage((prev) => prev - 1);
    }, [setPage]);
    const goNext = useCallback(() => {
        setPage((prev) => prev + 1);
    }, [setPage]);
    const goFirst = useCallback(() => {
        setPage(1);
    }, [setPage]);
    const goLast = useCallback(() => {
        setPage(maxPage);
    }, [maxPage, setPage]);

    const onChange = useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            setResultsPerPage(parseInt(ev.target.value, 10));
        },
        [setResultsPerPage]
    );
    const log = useLog();
    const [_a, _b, _c, toggleMany] = useSelectable();
    const [sortDescriptor] = useSorted();

    const records = useMemo(() => {
        const s = sortDescriptor();
        if (s.length > 0) {
            return realm.objects<any>(collection).sorted(s);
        }
        return realm.objects<any>(collection);
    }, [collection, realm, sortDescriptor]);
    const selectAll = useCallback(() => {
        const range = rangeBetween(start, end);

        const items = records.filter((x, ix) => range.includes(ix)).map((x) => x._id.toHexString());
        toggleMany(items);
    }, [end, records, start, toggleMany]);
    const onKeyDown = useCallback(
        (ev: React.KeyboardEvent) => {
            const { key } = ev;
            if (key === 'Enter') {
                ev.stopPropagation();
                ev.preventDefault();
                setEffective();
            }
        },
        [setEffective]
    );
    const currentKey = `jitt::grid::results-per-page/${collection}`;
    const readValue = useCallback(() => {
        log('readValue');
        const value = parseInt(localStorage.getItem(currentKey) ?? '25', 10);
        if (value !== effective) {
            setResultsPerPage(value);
            setEffective();
        }
    }, [currentKey, effective, log, setEffective, setResultsPerPage]);
    useEffect(() => {
        if (!isInit.current) {
            readValue();
            isInit.current = true;
        }
    }, [readValue]);
    const saveValue = useCallback(() => {
        log('IN SAVE');
        log(`running save value ${currentKey}`);
        localStorage.setItem(currentKey, resultsPerPage.toFixed(0));
    }, [currentKey, log, resultsPerPage]);
    useEffect(() => {
        app.once('will-quit', saveValue);
        BrowserWindow.getFocusedWindow()?.webContents.once('did-navigate', saveValue);
    }, [saveValue]);

    return (
        <section className='flex flex-col'>
            <header className='flex flex-row justify-between'>
                <span className='flex flex-row ml-3 space-x-0.5 p-0.5'>
                    {collection.split('').map((x, ix) => {
                        return <DuotoneIcon key={ix} icon={getLetterIcon(x)!} size='2x' primary='aqua' secondary='indigo' className='block w-8 h-8' />;
                    })}
                </span>
                <span className='flex flex-grow w-full'>
                    <label
                        id='resultsPerPage-input-label'
                        htmlFor='resultsPerPage-input'
                        className='flex  after:content-["_"] font-fira-sans font-bold text-lg indent-4 whitespace-pre'>
                        Results Per Page:
                    </label>
                    <input
                        name='resultsPerPage'
                        id='resultsPerPage-input'
                        value={Math.min(maxIndex + 1, resultsPerPage)}
                        type='text'
                        className='flex px-5 text-base font-semibold font-fira-sans py-1.5 border border-double border-black rounded-lg shadow-inner shadow-black bg-cyan-light text-blue-dark'
                        step={1}
                        min={1}
                        max={maxIndex + 1}
                        onChange={onChange}
                        onBlur={setEffective}
                        onKeyDown={onKeyDown}
                    />
                </span>
            </header>
            <table className='table-auto order-collapse '>
                <thead>
                    <HeaderComponent selectAll={selectAll} Definition={Definitions} />
                </thead>
                <Pagination
                    columnList={columnList}
                    ImmutableRowComponent={ImmutableRowComponent}
                    MutableRowComponent={MutableRowComponent}
                    editableRow={editableRow}
                    Definition={Definitions}
                    EditControlsComponent={EditControlsComponent}
                    data={records}
                    start={start}
                    end={end}
                />
            </table>
            <footer className='flex w-full'>
                <PaginationControls
                    canGoNext={canGoNext}
                    canGoPrevious={canGoPrevious}
                    nextPage={goNext}
                    previousPage={goPrevious}
                    firstPage={goFirst}
                    lastPage={goLast}
                    currentPage={page}
                    maxPage={maxPage}
                    pageStats={pageStats}
                />
            </footer>
        </section>
    );
}
