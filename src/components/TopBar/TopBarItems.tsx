import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { $cn } from '../../util/$cn';
import { ModuleMenu } from '../ModuleMenu';
import { NavMenuItem } from '../NavMenu/NavMenuItem';
import { RootMenuListItems } from '../RootMenu';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require('./../../assets/logos/resized-logo.png');

export const TopBarItems = {
    AuthButtons: {
        Login: React.memo(
            () => <NavMenuItem className='px-3 nav-button auth-button' to='/login' label='Log-In' />,
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
