import { useReactiveVar } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { $cn } from './$cn';
import { $currentUser } from './App';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { ButtonListItem } from './ButtonListItem';
import { isLower } from '../common/text/isLower';
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
export function isUpper(s: string) {
    return s.toUpperCase() === s && s.toLowerCase() !== s;
}
export function isSnakeCase(str: string) {
    return str.includes('_') && str.split('').every((x) => !isUpper(x));
}
export function isPascalCase(str: string) {
    return !str.includes('-') && !str.includes('_') && !str.includes(' ') && str.split('').some(isLower) && isUpper(str[0]);
}
export function isTitleCase(str: string) {
    return str.includes(' ') || (!str.includes('-') && !str.includes('_') && isUpper(str[0]));
}

type PulseStatus = 'fading-in' | 'fading-out' | 'faded' | 'not-faded';
export function cyclePulseStatus(current: PulseStatus) {
    switch (current) {
        case 'faded':
            return 'fading-in';
        case 'fading-in':
            return 'not-faded';
        case 'fading-out':
            return 'faded';
        case 'not-faded':
            return 'fading-out';
    }
}
export function usePulsingAnimation<T extends React.HTMLAttributes<HTMLElement>>(...classes: string[]) {
    const [status, setStatus] = useState<PulseStatus>('faded');
    const cycleStatus = useCallback(() => setStatus(cyclePulseStatus), []);
    const onTransitionEnd = cycleStatus;
    const cn =
        (props: T) =>
        ({ isActive }: { isActive: boolean }) =>
            $cn(
                props,
                {
                    'ring-opacity-100': isActive && (status === 'not-faded' || status === 'fading-in'),
                    'ring-opacity-0': isActive && (status === 'fading-out' || status === 'faded')
                },
                ...classes
            );
    useEffect(() => {
        if (status === 'faded' || status === 'not-faded') {
            setTimeout(() => cycleStatus(), 500);
        }
    });
    return { status, cycleStatus, cn, onTransitionEnd };
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
                <NavLinkListItem className='px-3 nav-button auth-button' to='login'>
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
                const { cn, onTransitionEnd, cycleStatus, status } = usePulsingAnimation('flex');
                const $className = useCallback(({ isActive }: { isActive: boolean }) => cn({})({ isActive }).className, [cn]);
                return (
                    <NavLink className={$className} to='/' onTransitionEnd={onTransitionEnd}>
                        <img src={logo} className='object-scale-down h-14'></img>
                    </NavLink>
                );
            },
            () => true
        )
    }
};
export function TopBar() {
    const cu = useReactiveVar($currentUser);
    const logOutFunction = useCallback(() => {
        if (!cu) return Promise.resolve();
        return cu.logOut();
    }, [cu]);
    return (
        <nav className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-md shadow-md bg-sky-dark font-fira-sans mb-0.5 items-center justify-between'>
            <TopBarItems.Menu.Logo />
            <TopBarItems.Menu.ModuleMenu />
            <ButtonGroup>
                <TopBarItems.AuthButtons.Login />
                <ButtonListItem ix={1}>Register</ButtonListItem>
                <ButtonListItem ix={2} onClick={logOutFunction}>
                    Log-Out
                </ButtonListItem>
            </ButtonGroup>
        </nav>
    );
}
