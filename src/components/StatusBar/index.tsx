import React from 'react';
import { Items } from './Items';

export function StatusBar() {
    return (
        <footer className='flex w-full px-2 text-base font-bold text-white border border-white rounded-md bg-slate-very-dark'>
            <ul className='flex flex-row items-center justify-between w-full px-1 py-0.5'>
                <StatusBar.Items.OnlineStatus />
                <StatusBar.Items.QueryParams />
                <StatusBar.Items.AuthStatus />
            </ul>
        </footer>
    );
}
StatusBar.Items = Items;
