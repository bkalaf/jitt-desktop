import React from 'react';
import { NavLinkListItem } from "./NavLinkListItem";

export function RootMenu() {
    return (
        <>
            {['api', 'data', 'files', 'queues'].map((x, index) => (
                <NavLinkListItem className='px-3 nav-button' key={index} index={index} to={x} />
            ))}
        </>
    );
}
