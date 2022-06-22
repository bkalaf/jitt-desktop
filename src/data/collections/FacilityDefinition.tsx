import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { ObjectId } from 'bson';
import { Definition } from '../definitions/Definition';
import { Definitions } from '../definitions/Definitions';
import { useLocalRealm } from '../../hooks/useLocalRealm';
import { provinces } from '../enums/province';
import { countries } from '../enums/country';
import { isNotNil } from '../../common/isNotNull';
import { LookupEle } from '../definitions/LookupEle';
import { FormControl } from '../definitions/FormControl';
import { InputEle } from '../definitions/InputEle';
import { TypeDefinitionFunction } from '../definitions/index';
import { OutputEle } from "../definitions/OutputEle";

export function FacilityDefinition({ children }: { children: TypeDefinitionFunction<{}>; }) {
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
                name='selfStorage'
                displayName='Storage Name'
                optionLabel='name'
                optionValue='_id'
                lookupTable='self-storage'
                Control={LookupEle}
                Field={FormControl}>
                {children}
            </Definition>
            <Definition name='facilityNumber' displayName='Facility Number' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='email' displayName='E-mail' type='email' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='phone' displayName='Phone Number' type='tel' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='address.street' displayName='Street' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='address.suite' displayName='Suite' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition name='address.city' displayName='City' type='text' required Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition
                name='address.state'
                displayName='State / Province'
                type='text'
                required
                Control={LookupEle}
                enumMap={provinces}
                Field={FormControl}
                defaultValue='CA'>
                {children}
            </Definition>
            <Definition
                name='address.country'
                displayName='Country'
                type='text'
                required
                Control={LookupEle}
                enumMap={countries}
                Field={FormControl}
                defaultValue='US'>
                {children}
            </Definition>
            <Definition name='address.postalCode' displayName='Postal Code' type='text' Control={InputEle} Field={FormControl}>
                {children}
            </Definition>
            <Definition
                name='name'
                displayName='Name'
                Control={OutputEle}
                Field={FormControl}
                toOutput={(x: any) => {
                    const fd = (x: any) => ({
                        _id: new ObjectId(x._id),
                        address: {
                            street: x['address.street'],
                            suite: x['address.suite'],
                            city: x['address.city'],
                            state: x['address.state'],
                            country: x['address.country'],
                            postalCode: x['address.postalCode']
                        },
                        facilityNumber: x.facilityNumber,
                        email: x.email,
                        phone: x.phone,
                        selfStorage: realm.objectForPrimaryKey<any>('self-storage', new ObjectId(x.selfStorage))
                    });
                    const formdata = fd(x);
                    return [
                        formdata.selfStorage?.name,
                        [formdata.address.city, formdata.address.state].join(', '),
                        formdata.address.street?.split(' ').slice(1).join(' ')
                    ]
                        .filter(isNotNil)
                        .join('-');
                }}>
                {children}
            </Definition>
        </Definitions>
    );
}
