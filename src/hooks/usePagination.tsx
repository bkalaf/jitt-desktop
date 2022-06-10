import { useCallback, useMemo, useRef, useState } from 'react';
import React from 'react';
import { rangeBetween } from '../common';

export function usePagination<T>(
    data: Realm.Results<T>
): [
    resultsPerPage: number,
    setResultsPerPage: React.Dispatch<React.SetStateAction<number>>,
    maxIndex: number,
    maxPage: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    start: number,
    end: number,
    pages: Array<{ page: number; start: number; end: number }>,
    page: number,
    setEffective: () => void,
    effective: number
] {
    const [resultsPerPage, setResultsPerPage] = useState(25);
    const [effectiveResultsPerPage, setEffectiveResults] = useState(25);
    const [page, setPage] = useState(1);
    const maxIndex = useMemo(() => data.length - 1, [data.length]);
    const maxPage = useMemo(() => Math.ceil((maxIndex + 1) / effectiveResultsPerPage), [effectiveResultsPerPage, maxIndex]);
    const pages = useMemo(
        () =>
            rangeBetween(1, maxPage).map((page) => {
                const endIndex = page * effectiveResultsPerPage - 1;
                const startIndex = endIndex - (effectiveResultsPerPage - 1);
                return { page, start: startIndex, end: Math.min(maxIndex, endIndex) };
            }),
        [maxIndex, maxPage, effectiveResultsPerPage]
    );
    const { end, start } = useMemo(() => pages.find((p) => p.page === page) ?? { page: 1, start: 0, end: 0 }, [page, pages]);
    const setEffective = useCallback(() => {
        setEffectiveResults(resultsPerPage);
    }, [resultsPerPage]);
    return [resultsPerPage, setResultsPerPage, maxIndex, maxPage, setPage, start, end, pages, page, setEffective, effectiveResultsPerPage];
}
