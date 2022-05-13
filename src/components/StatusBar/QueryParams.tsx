import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { snd, toTitleCase } from '../../common';
import { StatusItem } from './StatusItem';

export function QueryParams() {
    const [searchParams, _setSearchParams] = useSearchParams();
    const current = useMemo(
        () => Array.from(searchParams.entries()).map(([k, v]) => [k, v.split('&').length, v.split('&').join('/')] as [string, number, string]),
        [searchParams]
    );
    const tooltip = current.map(([k, v, z]) => `${toTitleCase(k)}: ${v.toString()} :[${z}]`).join('\n');
    return (
        <StatusItem className='text-white bg-blue' title={tooltip}>
            <span>
                Query:{' '}
                {current
                    .map((x) => x[1])
                    .reduce((pv, cv) => pv + cv, 0)
                    .toString()}
            </span>
        </StatusItem>
    );
}
