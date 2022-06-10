import React from 'react';
import { DefinedType } from './definitions';
import { faCheckSquare } from '@fortawesome/pro-duotone-svg-icons';
import { ignore } from '../common/ignore';
import { TableHeaderCell } from './definitions/TableHeaderCell';
import { DuotoneIcon } from '../components/icons/DuotoneIcon';
import { appSettings } from '../settings';
import { useSorted } from '../components/useSorted';
import { OpSymbol } from '../components/MainRouter';
import { Menu } from '@electron/remote';

export function Headers({ Definition, selectAll }: { selectAll: () => void; Definition: DefinedType }) {
    return (
        <tr className='text-white'>
            <th className='text-xl font-bold tracking-wide text-white border border-white font-fira-sans bg-zinc-dark px-2 py-0.5'>
                <button className='block text-center' onClick={selectAll} title='Select all...'>
                    <DuotoneIcon icon={faCheckSquare} primary='white' secondary='yellowgreen' size='2x'></DuotoneIcon>
                </button>
            </th>
            <th className='text-xl font-bold tracking-wide text-white border border-white font-fira-sans bg-zinc-dark px-2 py-0.5' title='Edit row'></th>
            <Definition>{TableHeaderCell}</Definition>
            <th className='text-xl font-bold tracking-wide text-white border border-white font-fira-sans bg-zinc-dark px-2 py-0.5' title='Delete row'></th>
        </tr>
    );
}
