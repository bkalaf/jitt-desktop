import React from 'react';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { $cn } from './$cn';
import { Button } from './Button';

export function ButtonListItem(props: { ix: number; children?: Children } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    useWhyDidYou(ButtonListItem.name, props);
    const { ix, ...spread } = $cn(props, {}, 'px-2 py-1 nav-button auth-button py-1.5');
    return (
        <li key={ix} className='flex'>
            <Button {...spread}></Button>
        </li>
    );
}
