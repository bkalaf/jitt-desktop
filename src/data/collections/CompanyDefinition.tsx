import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { ObjectId } from 'bson';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import useLocalRealm from '../../hooks/useLocalRealm';
import { FormControl } from '../definitions/FormControl';
import { TextInputDef } from '../definitions/TextInputDef';
import { InputEle } from '../definitions/InputEle';
import { TypeDefinitionFunction, uniqueValidator, ReferenceDef } from '../definitions/index';

export function CompanyDefinition({ children }: { children: TypeDefinitionFunction<{}>; }) {
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
            <TextInputDef name='name' type='text' required validators={[uniqueValidator('company', 'name')]}>
                {children}
            </TextInputDef>
            <ReferenceDef name='parent' lookupTable='company' label='name' sort={[['name', false]]}>
                {children}
            </ReferenceDef>
        </Definitions>
    );
}
