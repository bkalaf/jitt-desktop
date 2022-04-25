import React from 'react';
import { NavLinkListItem } from './NavLinkListItem';

export function RootMenuListItems() {
    return (
        <>
            {['api', 'data', 'files', 'queues'].map((x, index) => (
                <NavLinkListItem className='px-3 nav-button' key={index} to={x} />
            ))}
        </>
    );
}
