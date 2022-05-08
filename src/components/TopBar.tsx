import { useReactiveVar } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { $cn } from './$cn';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { ButtonListItem } from './ButtonListItem';
import { $currentUser } from './globals';
import { NavLinkListItem } from './NavLinkListItem';
import { RootMenuListItems } from './RootMenu';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require('./../assets/logos/resized-logo.png');
export function LinkButton({ children, to }: { children: Children; to: string }) {
    return (
        <Link to={to} className='flex'>
            {children}
        </Link>
    );
}

export function ModuleMenu() {
    return (
        <ol className='flex flex-row p-3 space-x-1.5'>
            {['api', 'data', 'files', 'queues'].map((x, index) => (
                <NavLinkListItem className='px-3 nav-button' key={index} to={x} />
            ))}
        </ol>
    );
}
export const TopBarItems = {
    AuthButtons: {
        Login: React.memo(
            () => (
                <NavLinkListItem className='px-3 nav-button auth-button' to='/login'>
                    Log-In
                </NavLinkListItem>
            ),
            () => true
        )
    },
    Menu: {
        ModuleMenu: React.memo(ModuleMenu),
        MenuItem: undefined,
        ModuleMenuItems: React.memo(RootMenuListItems),
        Logo: React.memo(
            () => {
                const $className = useCallback(({ isActive }: { isActive: boolean }) => $cn({}, { isActive }).className, []);
                return (
                    <NavLink className={$className} to='/'>
                        <img src={logo} className='object-scale-down h-14'></img>
                    </NavLink>
                );
            },
            () => true
        )
    }
};

export function AuthSegment() {
    const cu = useReactiveVar($currentUser);
    const logOutFunction = useCallback(() => {
        if (!cu) return Promise.resolve();
        cu.logOut();
        $currentUser(null);
    }, [cu]);
    const { isAuthenticated } = useAuth();
    return (
        <ButtonGroup>
            {!isAuthenticated && <TopBarItems.AuthButtons.Login />}
            {!isAuthenticated && <ButtonListItem ix={1}>Register</ButtonListItem>}
            {isAuthenticated && (
                <ButtonListItem ix={2} onClick={logOutFunction}>
                    Log-Out
                </ButtonListItem>
            )}
        </ButtonGroup>
    );
}
export function TopBar() {
    return (
        <nav className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-md shadow-md bg-sky-dark font-fira-sans mb-0.5 items-center justify-between'>
            <TopBarItems.Menu.Logo />
            <TopBarItems.Menu.ModuleMenu />
            <AuthSegment />
        </nav>
    );
}
