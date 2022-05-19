import React, { useCallback, useState } from 'react';
import { DataOrModifiedFn } from 'use-async-resource';
import { rangeBetween, toTitleCase } from '../common';
import { RunActivityButton } from './RunActivityButton';
import * as Webdriver from 'webdriverio';
import { months } from '../data/enums/months';
import { toYearMonthDateFormat } from './toYearMonthDateFormat';
import { getGregorianDataFromAbsoluteDay } from '../common/date/getGregorianDataFromAbsoluteDay';
import { getAbsoluteDayFromDate } from '../common/date/getAbsoluteDayFromDate';

export const caldays = Object.fromEntries(
    Object.entries(months).map(([k, v]) => [
        k,
        Object.entries(months)
            .filter((x) => parseInt(x[0], 10) <= parseInt(k, 10))
            .map((x) => x[1])
            .reduce((pv, cv) => pv + cv, 0)
    ])
);
console.log(caldays);

export function useActivity(
    keySegment: string,
    daysTill: number,
    reader: DataOrModifiedFn<Webdriver.Browser<'async'>>,
    ActivityEl: React.FunctionComponent<{ reader: DataOrModifiedFn<Webdriver.Browser<'async'>> }>
): [Btn: React.FunctionComponent, title: string, last: string, next: string, date: number] {
    function inner(): [number, string] {
        const lastRunAbs = getAbsoluteDayFromDate(dateStamp);
        const nextRunAbs = lastRunAbs + daysTill;

        console.log(`lastRunAbs, nextRunAbs`, lastRunAbs, nextRunAbs);
        const result = [nextRunAbs, getGregorianDataFromAbsoluteDay(nextRunAbs)] as [number, string];
        console.log(`INNER RESULT`, result);
        return result;
    }
    const key = ['admin', 'activity', keySegment].join('::');
    const item = localStorage.getItem(key);
    const [dateStamp, updateDateStamp] = useState(item ? new Date(Date.parse(item)) : new Date('1900-01-01'));
    const setDateStamp = useCallback(
        (newValue: Date) => {
            updateDateStamp(newValue);
            localStorage.setItem(key, newValue.toISOString());
        },
        [key]
    );
    const [a, b] = inner();
    return [
        () => <RunActivityButton ActivityEl={ActivityEl} keySegment={keySegment} reader={reader} setDateStamp={setDateStamp} />,
        toTitleCase(keySegment),
        `lastRun: ${toYearMonthDateFormat(dateStamp)}`,
        `nextRun: ${b}`,
        daysTill
    ];
}
