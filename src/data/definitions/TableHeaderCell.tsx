import React from 'react';
import { IDefinitionProps } from './index';


export function TableHeaderCell(props: Omit<IDefinitionProps, 'children'>) {
    const { displayName, name, ...remain } = props;
    return (
        <th className='text-xl font-bold tracking-wide text-white border border-white font-fira-sans bg-blue-dark px-2 py-0.5' scope='col' key={name}>
            {displayName}
        </th>
    );
}
