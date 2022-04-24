import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { $cn } from './$cn';
import { toTitleCase } from './toTitleCase';

export function NavLinkListItem(props: { children?: Children; to: string; index: number } & React.HTMLAttributes<HTMLElement>) {
    useWhyDidYou(NavLinkListItem.name, props);
    const { to, index, children, className, ...spread } = $cn(props, {}, 'nav-item');
    return (
        <li key={index} className='flex'>
            <NavLink className={({ isActive }) => (isActive ? `${className} active` : `${className} not-active`)} to={to} {...spread}>
                {children != null ? children : toTitleCase(to)}
            </NavLink>
        </li>
    );
}
