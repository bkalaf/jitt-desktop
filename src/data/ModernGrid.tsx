import { useCallback, useEffect, useRef, useState } from 'react';
import React from 'react';
import { ObjectId } from 'bson';
import { useToggle } from '../hooks/useToggle';
import { Pagination } from './Pagination';
import { IViewProps } from './TypeLookup';
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { usePagination } from './usePagination';
import { PaginationControls } from './PaginationControls';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { DuotoneIcon } from '../components/icons/DuotoneIcon';
import { getLetterIcon } from './getLetterIcon';
import { useSelectable } from '../hooks/useSelectable';
import { rangeBetween } from '../common/array/rangeBetween';
import { matchPath } from 'react-router';

export function ModernGrid<T extends { _id: ObjectId } = { _id: ObjectId }>(props: IViewProps) {
    const {
        HeaderComponent,
        ImmutableRowComponent,
        MutableRowComponent,
        InsertControlsComponent,
        EditControlsComponent,
        Definitions,
        data,
        columnList,
        sort
    } = props;
    const [collection] = useRoutedCollection(true);
    const [editableRow, setEditableRow] = useState<string | undefined>(undefined);
    const [resultsPerPage, setResultsPerPage, maxIndex, maxPage, setPage, start, end, pageStats, page, setEffective] = usePagination(data);
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
    
    const onChange = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
        setResultsPerPage(parseInt(ev.target.value, 10));
    }, [setResultsPerPage]);
    const [_a, _b, _c, toggleMany] = useSelectable();
    const selectAll = useCallback(() => {
        const items = rangeBetween(start, end).map(x => x.toString());
        toggleMany(items);
    }, [end, start, toggleMany]);
    const onKeyDown = useCallback((ev: React.KeyboardEvent) => {
        const { key } = ev;
        if (key === 'Enter') { setEffective(); }
    }, [setEffective]);
    return (
        <section>
            <header className='flex flex-row justify-between'>
                <span className='flex flex-row ml-3 space-x-0.5 p-0.5'>
                    {collection.split('').map((x, ix) => {
                        return <DuotoneIcon key={ix} icon={getLetterIcon(x)!} size='2x' primary='white' secondary='orangered' className='block w-8 h-8' />;
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
                        type='number'
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
            <table>
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
                    data={data}
                    start={start}
                    end={end}
                />                
            </table>
            <footer>
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
