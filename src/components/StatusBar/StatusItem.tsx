import React from 'react';
import { $cn } from '../../util/$cn';

export function StatusItem(props: { className?: string; title?: string; children: Children }) {
    const spread = $cn(
        props,
        {},
        'inline-flex my-0.5 mx-2 font-fira-sans text-base font-bold leading-loose tracking-wide text-black rounded-lg  shadow-black shadow py-1 px-2'
    );
    return <li {...spread}></li>;
}
