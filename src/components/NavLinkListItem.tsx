import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { $cn } from './$cn';
import { toTitleCase } from '../common/text/toTitleCase';

export function NavLinkListItem(props: { children?: Children; to: string } & React.HTMLAttributes<HTMLElement>) {
    useWhyDidYou(NavLinkListItem.name, props);
    const { to, children, className, ...spread } = $cn(props, {}, 'nav-button');
    return (
        <li className='flex'>
            <NavLink className={({ isActive }) => (isActive ? `${className} active` : `${className} not-active`)} to={to} {...spread}>
                {children != null ? children : toTitleCase(to)}
            </NavLink>
        </li>
    );
}

export function MenuListItem(props: { children?: Children; to: string }) {
    const classNameFunc =
        (baseCn: string) =>
        ({ isActive }: { isActive: boolean }) =>
            $cn(props, {
                active: isActive,
                'not-active': !isActive
            });
    const children = props.children ? toTitleCase(props.to) : '';
}
