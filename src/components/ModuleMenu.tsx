import React from 'react';
import { NavLinkListItem } from './NavLinkListItem';

export function ModuleMenu() {
    return (
        <ol className='flex flex-row p-3 space-x-1.5'>
            {['api', 'data', 'files', 'queues'].map((x, index) => (
                <NavLinkListItem className='px-3 nav-button' key={index} to={x} />
            ))}
        </ol>
    );
}
