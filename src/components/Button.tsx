import React from 'react';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { $cn } from '../util/$cn';

export function Button(props: { children?: Children } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    useWhyDidYou(Button.name, props);
    const spread = $cn(props, {}, 'nav-button');
    return <button type='button' {...spread}></button>;
}
export function Btn(props: { children?: Children } & React.ButtonHTMLAttributes<HTMLButtonElement> & {flags?: Record<string, boolean> }) {
    useWhyDidYou(Button.name, props);
    const { flags, ...remain } = props;
    const spread = $cn(remain, flags, 'flex items-center justify-center w-auto h-auto border border-black rounded-lg shadow-lg fs-0 animate mx-auto hover:shadow-white outline-2 hover:bg-teal-dark focus:outline outline-transparent ring shadow-yellow px-2 py-0.5 bg-lime-dark text-black disabled:bg-rose-dark disabled:text-white');
    return <button type='button' {...spread}></button>;
}