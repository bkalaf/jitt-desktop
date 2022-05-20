import React, { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { distinct, toTitleCase } from '../common';
import { toYearMonthDateFormat } from './toYearMonthDateFormat';
import { getAbsoluteDayFromDate } from '../common/date/getAbsoluteDayFromDate';
import { getGregorianDataFromAbsoluteDay } from '../common/date/getGregorianDataFromAbsoluteDay';
import { useOnEvent } from '../hooks/useOnEvent';
import { $$eventNames } from './AdminMenu';
import { useEventAggregator } from './useEventAggregator';
import { useLocalStorageKey } from './useLocalStorageKey';
import { useEmit } from './useEmit';
import { useToggle } from '../hooks/useToggle';

export function ImportActivity({ keySegment, ImportActionComponent }: { keySegment: string; ImportActionComponent: React.FunctionComponent }) {
    const emitter = useEventAggregator();
    const lsKey = useLocalStorageKey('admin', 'import', keySegment, 'last-executed');
    const lsKey2 = useLocalStorageKey('admin', 'import', keySegment, 'next-execute');
    const [enableImport, toggleImport] = useToggle(false);
    const [lastExecuted, setLastExecuted, lastExecutedOutput] = useLocalStorage(
        lsKey,
        (x) => (x == null ? new Date(Date.now()) : new Date(Date.parse(x))),
        (x: Date | null) => x?.toUTCString() ?? new Date(Date.now()).toUTCString()
    );
    const [nextExecute, setNextExecute, nextExecutOutput] = useLocalStorage(
        lsKey2,
        (x) => (x == null ? new Date(Date.now()) : new Date(Date.parse(x))),
        (x: Date | null) => x?.toUTCString() ?? new Date(Date.now()).toUTCString()
    );
    const title = toTitleCase(keySegment);

    const logExecution = useCallback(() => {
        toggleImport();
        const stamp = new Date(Date.now());
        setLastExecuted(stamp);
        setNextExecute(new Date(Date.parse(getGregorianDataFromAbsoluteDay(getAbsoluteDayFromDate(stamp) + 14))));
    }, [setLastExecuted, setNextExecute, toggleImport]);

    const cb = useCallback(
        (evKey: string) => {
            if (lsKey.startsWith(evKey)) {
                logExecution();
            }
        },
        [logExecution, lsKey]
    );
    useOnEvent($$eventNames.executeAction, cb, emitter);

    const countdown = useMemo(() => getAbsoluteDayFromDate(nextExecute ?? new Date(Date.now())) - getAbsoluteDayFromDate(new Date(Date.now())), [nextExecute]);

    const onClick = useEmit(emitter, $$eventNames.executeAction, lsKey);
    return (
        <li className='flex flex-col py-1 text-lg font-semibold leading-loose tracking-wide border-2 border-black rounded-lg shadow-md bg-indigo text-slate-dark font-fira-sans shadow-black'>
            <button type='button' className='flex flex-col w-full h-full' onClick={onClick}>
                <div className='flex flex-row items-center justify-between w-full '>
                    <span className='inline-flex text-2xl font-semibold font-fira-sans indent-5'>{title}</span>
                    <span className='inline-flex mr-2'>Last Executed: {toYearMonthDateFormat(new Date(Date.parse(lastExecutedOutput)))}</span>
                </div>
                <div className='flex flex-row items-center justify-end text-base'>
                    <span
                        className={`inline-flex mr-2 ${
                            countdown > 5 && countdown <= 10
                                ? 'bg-yellow font-bold text-black p-0.5 border border-black rounded-lg '
                                : countdown > 0 && countdown <= 5
                                ? 'bg-orange font-bold underline-offset-2 underline decoration-orange text-black p-0.5 border border-black rounded-lg '
                                : countdown <= 0
                                ? 'bg-red font-bold underline-offset-2 decoration-red underline text-black p-0.5 border border-black rounded-lg '
                                : 'text-black'
                        }`}>
                        Next Execute: {toYearMonthDateFormat(new Date(Date.parse(nextExecutOutput)))}
                    </span>
                </div>
            </button>
            {enableImport && <ImportActionComponent />}
        </li>
    );
}
