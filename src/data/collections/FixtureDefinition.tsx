/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/no-children-prop */
import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { ObjectId } from 'bson';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import { useLocalRealm } from '../../hooks/useLocalRealm';
import { FormControl } from '../definitions/FormControl';
import { TextAreaDef, TextInputDef } from '../definitions/TextInputDef';
import { InputEle } from '../definitions/InputEle';
import { TypeDefinitionFunction, ReferenceDef, uniqueValidator } from '../definitions/index';

export function FixtureDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
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
            <TextInputDef name='name' children={children} validators={[uniqueValidator('fixture', 'name')]}/>
            <TextAreaDef name='notes' rows={3} children={children} />
            <ReferenceDef lookupTable='barcode' label='barcode' children={children} name='barcode' sort={[['barcode', false]]} filter='@links.@count == 0' />
        </Definitions>
    );
}

