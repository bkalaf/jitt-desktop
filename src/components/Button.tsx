import React from 'react';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { $cn } from '../util/$cn';

export function Button(props: { children?: Children } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    useWhyDidYou(Button.name, props);
    const spread = $cn(props, {}, 'nav-button');
    return <button type='button' {...spread}></button>;
}
