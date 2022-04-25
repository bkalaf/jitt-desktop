import { useReactiveVar } from '@apollo/client';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { $cn } from './$cn';
import { $currentUser } from './App';
import { Button } from './Button';
import { ButtonGroup } from './ButtonGroup';
import { ButtonListItem } from './ButtonListItem';
import { isLower } from '../common/text/isLower';
import { NavLinkListItem } from './NavLinkListItem';
import { TopBarItems } from './TopBarItems';
// eslint-disable-next-line @typescript-eslint/no-var-requires

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
            <TopBarItems.Menu.ModuleMenuItems />
        </ol>
    );
}
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
