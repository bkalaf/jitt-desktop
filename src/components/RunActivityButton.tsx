import React from 'react';
import { toTitleCase } from '../common';
import { useToggle } from '../hooks/useToggle';
import { DataOrModifiedFn } from 'use-async-resource';
import * as Webdriver from 'webdriverio';
import { useLog } from './providers/buildLibrary';

export function RunActivityButton({
    keySegment,
    ActivityEl,
    reader,
    setDateStamp
}: {
    keySegment: string;
    ActivityEl: React.FunctionComponent<{ reader: DataOrModifiedFn<Webdriver.Browser<'async'>>; onComplete: (d: Date) => void }>;
    reader: DataOrModifiedFn<Webdriver.Browser<'async'>>;
    setDateStamp: (d: Date) => void;
}) {
    const [engaged, toggleEngaged] = useToggle(false);
    const title = toTitleCase(keySegment);
    return (
        <>
            <button
                type='button'
                className='inline-flex w-1/2 px-3 py-1 text-black border border-black rounded-lg shadow-inner bg-amber shadow-white'
                onClick={toggleEngaged}>
                Run {title}
            </button>
            {engaged && <ActivityEl reader={reader} onComplete={setDateStamp} />}
        </>
    );
}
