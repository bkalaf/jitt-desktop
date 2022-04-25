import React from 'react';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { $cn } from './$cn';


export function ButtonGroup(props: { children: Children; }) {
    useWhyDidYou(ButtonGroup.name, props);
    const { children, ...spread } = $cn(props, {}, 'flex space-x-2 flex-row p-3');
    return <ol {...spread}>{children}</ol>;
}
