import React from 'react';
import { DataOrModifiedFn } from 'use-async-resource';
import * as Webdriver from 'webdriverio';
import { useActivity } from './useActivity';

export function ActivityEntry({
    keySegment,
    repeatInDays,
    ActivityEl,
    reader,
    aList,
    bList
}: {
    keySegment: string;
    repeatInDays: number;
    ActivityEl: React.FunctionComponent<{ reader: DataOrModifiedFn<Webdriver.Browser<'async'>> }>;
    reader: DataOrModifiedFn<Webdriver.Browser<'async'>>;
    aList?: any[];
    bList?: any[];
}) {
    const [Btn, title, last, next, days] = useActivity(keySegment, repeatInDays, reader, ActivityEl);
    const key = `admin::activity::${keySegment}`;

    aList?.push(
        (): JSX.Element => (
            <li className='flex flex-col py-1 text-lg font-semibold leading-loose tracking-wide border border-black shadow-inner bg-sky-light text-blue-dark font-fira-sans shadow-black'>
                <div className='flex flex-row items-center justify-between '>
                    <span className='inline-flex ml-2 text-2xl'>{title}</span>
                    <span className='inline-flex mr-2'>{last}</span>
                </div>
                <div className='flex flex-row items-center justify-end'>
                    <span
                        className={`inline-flex mr-2 ${
                            days > 5 && days <= 10
                                ? 'bg-yellow font-bold text-black p-0.5 border border-black rounded-lg '
                                : days > 0 && days <= 5
                                ? 'bg-orange font-bold underline-offset-2 underline decoration-orange text-black p-0.5 border border-black rounded-lg '
                                : days <= 0
                                ? 'bg-red font-bold underline-offset-2 decoration-red underline text-black p-0.5 border border-black rounded-lg '
                                : 'text-black'
                        }`}>
                        {next}
                    </span>
                </div>
            </li>
        )
    );
    bList?.push(Btn);
    return null;
}
