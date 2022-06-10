import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { ObjectId } from 'bson';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import { FormControl } from '../definitions/FormControl';
import { InputEle } from '../definitions/InputEle';
import { IDefinitionProps, uniqueValidator, NullElement } from '../definitions/index';

export function SelfStorageDefinition({ children }: { children: (props: Omit<IDefinitionProps, 'children'>) => JSX.Element | null; }) {
    return (
        <Definitions>
            <Definition
                name='_id'
                displayName='ID'
                icon={faKey}
                iconSize='lg'
                tooltipFunction='x => x.toHexString()'
                required
                readOnly
                convertFromFD={(x: string) => new ObjectId(x)}
                convertToFD={(x: ObjectId) => x.toHexString()}
                init={() => new ObjectId()}
                Control={InputEle}
                Field={FormControl}>
                {children}
            </Definition>
            <Definition
                name='name'
                displayName='Name'
                required
                validators={[uniqueValidator('self-storage', 'name')]}
                type='text'
                Control={InputEle}
                Field={FormControl}>
                {children}
            </Definition>
            <Definition name='website' displayName='Website' type='url' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='facilities' displayName='Facility Count' toSummary={(x) => (x ? x.length : 0)} Control={NullElement} Field={FormControl}>
                {children}
            </Definition>
        </Definitions>
    );
}
