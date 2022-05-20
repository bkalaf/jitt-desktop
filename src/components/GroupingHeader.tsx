import React from 'react';
import { ActivityAction } from "../ActivityAction";
import { $cn } from '../util/$cn';

export function GroupingHeader({ children, action }: { children: Children; action?: ActivityAction }) {
    const spread = $cn({}, {
        'bg-rose-dark text-white': action === 'scrape',
        'bg-lime-dark text-white': action === 'import',
        'bg-slate-very-dark text-white': action == null,
    }, 'flex text-4xl font-extrabold leading-loose tracking-wider text-white font-fira-sans indent-5 border border-double border-4 border-black p-1 rounded-xl shadow-white shadow-lg underline decoration-double');
    return <header {...spread}>{children}</header>;
}
