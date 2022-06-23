import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { ObjectId } from 'bson';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import useLocalRealm from '../../hooks/useLocalRealm';
import { FormControl } from '../definitions/FormControl';
import { TextInputDef } from '../definitions/TextInputDef';
import { InputEle } from '../definitions/InputEle';
import { TypeDefinitionFunction, ReferenceDef, uniqueValidator } from '../definitions/index';


export function ProductLineDefinition({ children }: { children: TypeDefinitionFunction; }) {
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
            <TextInputDef name='name' children={children} validators={[uniqueValidator('product-line', 'name')]} />
            <ReferenceDef lookupTable='brand' label='name' children={children} name='brand' sort={[['name', false]]} />
        </Definitions>
    );
}
