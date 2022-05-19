import React from 'react';

export function MenuGrouping({ children }: { children: Children; }) {
    return <ul className='p-1 space-y-2'>{children}</ul>;
}
