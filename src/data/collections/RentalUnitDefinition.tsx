import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { ObjectId } from 'bson';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import useLocalRealm from '../../hooks/useLocalRealm';
import { lengthUOMS } from '../enums';
import { LookupEle } from '../definitions/LookupEle';
import { FormControl } from '../definitions/FormControl';
import { InputEle } from '../definitions/InputEle';
import { TypeDefinitionFunction } from '../definitions/index';
import { OutputEle } from "../definitions/OutputEle";

export function RentalUnitDefinition({ children }: { children: TypeDefinitionFunction<{}>; }) {
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
            <Definition
                name='facility'
                displayName='Facility'
                Control={LookupEle}
                Field={FormControl}
                lookupTable='facility'
                optionLabel='name'
                optionValue='_id'>
                {children}
            </Definition>
            <Definition name='unit' displayName='Unit #' Control={InputEle} Field={FormControl} type='text' required>
                {children}
            </Definition>
            <Definition name='size.length.value' displayName='Length' Control={InputEle} Field={FormControl} type='number' step={1}>
                {children}
            </Definition>
            <Definition name='size.length.uom' displayName='Length UOM' Control={LookupEle} Field={FormControl} enumMap={lengthUOMS}>
                {children}
            </Definition>
            <Definition name='size.width.value' displayName='Width' Control={InputEle} Field={FormControl} type='number' step={1}>
                {children}
            </Definition>
            <Definition name='size.width.uom' displayName='Width UOM' Control={LookupEle} Field={FormControl} enumMap={lengthUOMS}>
                {children}
            </Definition>
            <Definition
                name='name'
                displayName='Name'
                Control={OutputEle}
                Field={FormControl}
                toOutput={(x: any) => {
                    const toFd = (y: any) => ({
                        facility: realm.objectForPrimaryKey<{ address: { street: string; city: string; state: string; }; selfStorage: { name: string; }; }>(
                            'facility',
                            new ObjectId(y.facility)
                        ),
                        unit: y.unit
                    });
                    const fd = toFd(x);
                    return [
                        fd.facility?.selfStorage.name,
                        [fd.facility?.address.city, fd.facility?.address.state].join(','),
                        fd.facility?.address.street.split(' ').slice(1).join(' '),
                        fd.unit
                    ].join('-');
                }}>
                {children}
            </Definition>
        </Definitions>
    );
}
