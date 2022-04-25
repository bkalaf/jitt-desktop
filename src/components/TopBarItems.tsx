import React, { useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { NavLinkListItem } from './NavLinkListItem';
import { RootMenuListItems } from './RootMenu';
import { ModuleMenu, usePulsingAnimation } from './TopBar';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require('./../assets/logos/resized-logo.png');

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
        ModuleMenu: React.memo(ModuleMenu, () => true),
        MenuItem: undefined,
        ModuleMenuItems: React.memo(RootMenuListItems, () => true),
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
