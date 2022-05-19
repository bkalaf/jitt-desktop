import React from 'react';
import { APP_CONFIG } from '../../config';
import { MainMenuItem } from './MainMenuItem';

export function MainMenu() {
    const opts = APP_CONFIG.ui.mainMenu;

    return (
        <ol className='grid items-center justify-center grid-cols-6 p-3 space-x-2'>
            {opts.map(([label, to], ix) => (
                <MainMenuItem key={ix} label={label} to={to} />
            ))}
        </ol>
    );
}
MainMenu.Item = MainMenuItem;