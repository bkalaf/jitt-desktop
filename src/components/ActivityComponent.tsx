import React, { useCallback, useEffect, useRef } from 'react';
import { ignore, toTitleCase } from '../common';
import { Admin } from '../data';
import { $cn } from '../util/$cn';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLog } from '../hooks/useLog';
import { now } from '../aggregator';
import { invalidateRefetch } from '../queries';
import { ActivityActions, ActivityScopes } from '../data/enums';
import { $ } from '../data/$';

export function ActivityComponent(props: {
    activity?: Realm.Results<Admin.Activity>;
    action: ActivityActions;
    scope: ActivityScopes;
    mutationFunc: (props: {
        onDemand: boolean;
        realm: Realm;
        log: any;
        scheduledItem: Admin.Activity | undefined;
        action: ActivityActions;
        scope: ActivityScopes;
    }) => Promise<void>;
    doNotRun?: boolean;
}) {
    const { doNotRun, activity, action, scope, mutationFunc } = props;
    const filteredActivities = activity?.filtered('action == $0 && scope == $1', action, scope);

    const { data: scheduledItem } = useQuery([action, scope, 'scheduledItem'], () => filteredActivities?.filtered('isScheduled == $0', true)[0], {
        suspense: true
    });

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
            'bg-yellow font-bold text-black p-0.5 border border-black rounded-lg font-semibold': countdown > 5 && countdown <= 10,
            'bg-orange font-bold underline-offset-2 underline decoration-orange text-black p-0.5 border border-black rounded-lg font-semibold':
                countdown > 0 && countdown <= 5,
            'bg-red font-bold underline-offset-2 decoration-red underline text-black p-0.5 border border-black rounded-lg font-semibold': countdown <= 0,
            'text-black bg-yellow-minimal shadow-inner shadow-white rounded-lg font-semibold border border-black': countdown > 10
        },
        'flex mr-2'
    );

    const token = useRef<NodeJS.Timeout | undefined>(undefined);

    const realm = useLocalRealm();
    const log = useLog();
    const queryClient = useQueryClient();
    const mutation = useMutation(
        ({ onDemand }: { onDemand: boolean }) => {
            return mutationFunc({ onDemand, realm, action, scope, scheduledItem, log });
        },
        {
            onSuccess: () => {
                const cata = invalidateRefetch(queryClient);
                cata($.activity);
                cata(action, scope);
            }
        }
    );

    useEffect(() => {
        if (!doNotRun) {
            const timeoutMs = scheduledItem != null ? scheduledItem.when.valueOf() - now().valueOf() : 10000000;
            token.current = setTimeout(() => {
                console.log('SCHEDULED ACTION: ');
                mutation.mutate({ onDemand: false });
            }, timeoutMs);
            return () => (token.current != null ? clearTimeout(token.current) : ignore());
        }
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
                <div className='flex items-start justify-start flex-shrink w-1/3 '>
                    <span className='inline-flex mt-2 ml-2 text-2xl font-semibold font-fira-sans'>{toTitleCase([action, scope].join('-'))}</span>
                </div>
                <div className='flex flex-col items-center justify-between flex-grow w-2/3 text-base'>
                    <span className='inline-flex mr-2 text-black p-0.5 border border-white/50   bg-yellow-minimal shadow-inner shadow-white rounded-lg font-semibold border-black'>
                        LastRun: {lastRun?.toLocaleString()}
                    </span>
                    <span {...spread}>NextRun: {nextRun?.toLocaleString()}</span>
                </div>
            </button>
        </li>
    );
}
