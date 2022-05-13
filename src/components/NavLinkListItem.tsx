import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { $cn } from '../util/$cn';
import { toTitleCase } from '../common/text/toTitleCase';

export function NavLinkListItem(props: { children?: Children; to: string } & React.HTMLAttributes<HTMLElement>) {
    useWhyDidYou(NavLinkListItem.name, props);
    const { to, children, className, ...spread } = $cn(props, {}, 'nav-button');
    return (
        <li className='flex'>
            <NavLink className={({ isActive }) => (isActive ? `${className} bg-white shadow-lg shadow-red` : `${className}`)} to={to} {...spread}>
                {children != null ? children : toTitleCase(to)}
            </NavLink>
        </li>
    );
}


