import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { distinct, fst, ignore, toTitleCase } from '../common';
import { toYearMonthDateFormat } from './toYearMonthDateFormat';
import { getAbsoluteDayFromDate } from '../common/date/getAbsoluteDayFromDate';
import { getGregorianDataFromAbsoluteDay } from '../common/date/getGregorianDataFromAbsoluteDay';
import { useOnEvent } from '../hooks/useOnEvent';
import { $$eventNames } from './AdminMenu';
import { useEventAggregator } from './useEventAggregator';
import { useLocalStorageKey } from './useLocalStorageKey';
import { useEmit } from './useEmit';
import { useToggle } from '../hooks/useToggle';
import { Activity, ActivityAction, ActivityScope, mongo, VerifiedBrand } from '../data';
import { $cn } from '../util/$cn';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { files } from '../config';
import { readFile } from '../common/fs/readFile';
import { useLog } from './providers/buildLibrary';
import { now } from '../aggregator';
import { invalidateRefetch } from '../queries';
export function ActivityComponent(props: { activity?: Realm.Results<Activity>; action: ActivityAction; scope: ActivityScope; mutationFunc: (props: { onDemand: boolean }) => Promise<void> }) {
    const { activity, action, scope } = props;
    const filteredActivities = activity?.filtered('action == $0 && scope == $1', action, scope);
    
    const { data: scheduledItem } = useQuery([action, scope, 'scheduledItem'], () => filteredActivities?.filtered('isScheduled == $0', true)[0], { suspense: true });

    const { data: lastRun } = useQuery([action, scope, 'lastRun'], () => filteredActivities?.filtered('isComplete == $0', true).max('when') as Date, {
        suspense: true
    });

    const { data: nextRun } = useQuery([action, scope, 'nextRun'], () => filteredActivities?.filtered('isScheduled == $0', true).min('when') as Date, {
        suspense: true
    });

    const countdown = Math.floor((nextRun?.valueOf() ?? Number.MAX_VALUE - (lastRun?.valueOf() ?? 0)) / (1000 * 60 * 60 * 24));

    const spread = $cn(
        {},
        {
            'bg-yellow font-bold text-black p-0.5 border border-black rounded-lg': countdown > 5 && countdown <= 10,
            'bg-orange font-bold underline-offset-2 underline decoration-orange text-black p-0.5 border border-black rounded-lg ':
                countdown > 0 && countdown <= 5,
            'bg-red font-bold underline-offset-2 decoration-red underline text-black p-0.5 border border-black rounded-lg ': countdown <= 0,
            'text-black': countdown > 10
        },
        'flex mr-2'
    );

    const token = useRef<NodeJS.Timeout | undefined>(undefined);

    const realm = useLocalRealm();
    const log = useLog();
    const queryClient = useQueryClient();
    const mutation = useMutation(
        ({ onDemand = false }: { onDemand: boolean }) => {
            const data: string[] = JSON.parse(readFile(files.brandListings)).uniqueBrands.map(fst);
            const uniqueData = Array.from(new Set(data).values());
            const verifiedBrands = realm.objects<VerifiedBrand>(mongo.verifiedBrand).map((x) => x.name);
            const dataNotIn = uniqueData.filter((x) => !verifiedBrands.includes(x));

            dataNotIn.forEach((x) => {
                realm.write(() => {
                    log(`handling: ${x}`);
                    realm.create(mongo.verifiedBrand, { _id: new Realm.BSON.ObjectId(), name: x });
                });
            });

            if (!onDemand) {
                if (scheduledItem) {
                    realm.write(() => {
                        scheduledItem.isComplete = true;
                        scheduledItem.isScheduled = false;
                        realm.create<Activity>(mongo.activity, {
                            _id: new Realm.BSON.ObjectId(),
                            action,
                            scope,
                            when: new Date(Date.parse(getGregorianDataFromAbsoluteDay(getAbsoluteDayFromDate(now()) + 14))),
                            isComplete: false,
                            isScheduled: true
                        });
                    });
                } else {
                    realm.write(() => {
                        realm.create<Activity>(mongo.activity, {
                            _id: new Realm.BSON.ObjectId(),
                            action,
                            scope,
                            when: now(),
                            isComplete: true,
                            isScheduled: false
                        });
                        realm.create<Activity>(mongo.activity, {
                            _id: new Realm.BSON.ObjectId(),
                            action,
                            scope,
                            when: new Date(Date.parse(getGregorianDataFromAbsoluteDay(getAbsoluteDayFromDate(now()) + 14))),
                            isComplete: false,
                            isScheduled: true
                        });
                    });
                }
            } else {
                realm.write(() => {
                    realm.create<Activity>(mongo.activity, {
                        _id: new Realm.BSON.ObjectId(),
                        action,
                        scope,
                        when: now(),
                        isComplete: true,
                        isScheduled: false
                    });
                    realm.create<Activity>(mongo.activity, {
                        _id: new Realm.BSON.ObjectId(),
                        action,
                        scope,
                        when: new Date(Date.parse(getGregorianDataFromAbsoluteDay(getAbsoluteDayFromDate(now()) + 14))),
                        isComplete: false,
                        isScheduled: true
                    });
                });
            }

            return Promise.resolve();
        },
        {
            onSuccess: () => {
                const cata = invalidateRefetch(queryClient);
                cata(mongo.activity);
                cata(action, scope);                
            }
        }
    );

    useEffect(() => {
        const timeoutMs = scheduledItem != null ? scheduledItem.when.valueOf() - now().valueOf() : 10000000;
        token.current = setTimeout(() => {
            console.log('SCHEDULED ACTION: ');
            mutation.mutate({ onDemand: false });
        }, timeoutMs);
        return () => (token.current != null ? clearTimeout(token.current) : ignore());
    }, [mutation, scheduledItem]);
    const liSpread = $cn(
        {},
        {
            'bg-rose': action === 'scrape',
            'bg-lime': action === 'import'
        },
        'flex py-1 text-lg font-semibold leading-loose tracking-wide border-2 border-black rounded-lg shadow-md text-slate-dark font-fira-sans shadow-black'
    );
    const onClick = useCallback(() => mutation.mutate({ onDemand: true }), [mutation]);

    return (
        <li {...liSpread}>
            <button type='button' className='flex flex-row items-center justify-between w-full h-full' onClick={onClick}>
                <div className='flex flex-row items-start justify-start w-full '>
                    <span className='inline-flex mt-2 text-2xl font-semibold font-fira-sans indent-5'>{toTitleCase([action, scope].join('-'))}</span>
                </div>
                <div className='flex flex-col items-center justify-between text-base'>
                    <span className='inline-flex mr-2 font-normal text-black p-0.5 border border-white/50 rounded-lg'>
                        Last Executed: {lastRun?.toLocaleString()}
                    </span>
                    <span {...spread}>Next Execute: {nextRun?.toLocaleString()}</span>
                </div>
            </button>
        </li>
    );
}
export function ImportActivity({ keySegment, ImportActionComponent }: { keySegment: string; ImportActionComponent: React.FunctionComponent }) {
    const emitter = useEventAggregator();
    const lsKey = useLocalStorageKey('admin', 'import', keySegment, 'last-executed');
    const lsKey2 = useLocalStorageKey('admin', 'import', keySegment, 'next-execute');
    const [enableImport, toggleImport] = useToggimport { invalidateRefetch } from '../queries/index';
le(false);
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
