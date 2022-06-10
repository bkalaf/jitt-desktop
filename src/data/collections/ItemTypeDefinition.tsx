import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { ObjectId } from 'bson';
import { useLocalRealm } from '../../hooks/useLocalRealm';
import { TypeDefinitionFunction, uniqueValidator, ReferenceDef, ListInputDef, DatalistDef } from '../definitions';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import { FormControl } from '../definitions/FormControl';
import { InputEle } from '../definitions/InputEle';
import { TextInputDef } from '../definitions/TextInputDef';

export function ItemTypeDefinition({ children }: { children: TypeDefinitionFunction<{}>; }) {
    const realm = useLocalRealm();
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
            <TextInputDef name='name' required validators={[uniqueValidator('item-type', 'name')]}>
                {children}
            </TextInputDef>
            <ReferenceDef name='supertype' displayName='Inherit From' lookupTable='item-type' label='name'>
                {children}
            </ReferenceDef>
            <ListInputDef name='details' span={2}>
                {children}
            </ListInputDef>
            <DatalistDef name='classification' displayName='Classification' lookupTable='taxonomy' list='taxonomy-list' label='materializedPath'>
                {children}
            </DatalistDef>
            {/* <ReferenceDef name='taxonomy' displayName='Categorization' lookupTable='taxonomy' label='materializedPath'>
                {children}
            </ReferenceDef> */}
            {/* <LinkingObjDef name='taxonomy' displayName='Category Path' toSummary={(x) => x?.materializedPath}>
                {children}
            </LinkingObjDef> */}
        </Definitions>
    );
}
