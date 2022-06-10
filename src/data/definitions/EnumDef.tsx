import React from 'react';
import { toTitleCase } from '../../common';
import { Definition } from './Definition';
import { LookupEle } from './LookupEle';
import { FormControl } from './FormControl';
import { TypeDefinitionFunction } from './index';

export function EnumDef({
    children, enumMap, defaultValue, displayName: $displayName, name
}: {
    children: TypeDefinitionFunction<{}>;
    displayName?: string;
    name: string;
    defaultValue?: any;
    enumMap: Record<string, string>;
}) {
    const displayName = $displayName ? $displayName : toTitleCase(name);

    return (
        <Definition name={name} displayName={displayName} Control={LookupEle} enumMap={enumMap} Field={FormControl} defaultValue={defaultValue}>
            {children}
        </Definition>
    );
}
