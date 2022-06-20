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
import { LookupEle } from '../definitions/LookupEle';
import { provinces, countries } from '../enums';

export function LocationDefinition({ children }: { children: TypeDefinitionFunction<{}> }) {
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
            <TextInputDef name='name' children={children} validators={[uniqueValidator('location', 'name')]} />
            <TextAreaDef name='notes' rows={3} children={children} />
            <Definition name='address.street' displayName='Street' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='address.suite' displayName='Suite' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='address.city' displayName='City' type='text' required Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='address.state' displayName='State / Province' type='text' required Control={LookupEle} enumMap={provinces} Field={FormControl} defaultValue='CA'>
                {children}
            </Definition>
            <Definition name='address.country' displayName='Country' type='text' required Control={LookupEle} enumMap={countries} Field={FormControl} defaultValue='US'>
                {children}
            </Definition>
            <Definition name='address.postalCode' displayName='Postal Code' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
        </Definitions>
    );
}
