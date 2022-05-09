import { faKey, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { HTMLInputTypeAttribute } from 'react';
import { ObjectClass, SortDescriptor } from 'realm';
import { Address, Facility, SelfStorage } from '../../data';
import { countries } from '../../data/enums/country';
import { lengths } from '../../data/enums/lengthUOM';
import { provinces } from '../../data/enums/province';
import { Fieldset } from '../forms/elements/Fieldset';
import { FormElement, Input } from '../forms/elements/Input';
import { Output } from '../forms/elements/Output';
import { Select } from '../forms/elements/Select';
import { IFieldInfo } from "../../types/metadata/IFieldInfo";

export type ColumnScope = [string, string | undefined];

export const DAL: Record<
    string,
    {
        headers: string[];
        columns: string[];
        row: (x: any) => Array<string | undefined | Array<any>>;
        sorted: SortDescriptor[];
        fields: IFieldInfo[];
    }
> = {
    'self-storage': {
        sorted: [['name', false]],
        headers: ['ID', 'Name', 'Website'],
        columns: ['_id', 'name', 'website'],
        row: (x: SelfStorage) => [x._id.toHexString(), x.name, x.website],
        fields: [
            { el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true },
            { el: Input, name: 'name', required: true, minLength: 5, type: 'text' },
            { el: Input, name: 'website', type: 'url' }
        ]
    },
    address: {
        sorted: [],
        headers: ['Street', 'Suite', 'City', 'State/Province', 'Country', 'Postal/Zip Code'],
        columns: ['street', 'suite', 'city', 'state', 'country', 'postalCode'],
        row: (x: Address) => [x.street, x.suite, x.city, provinces[x.state], countries[x.country], x.postalCode],
        fields: [
            { el: Input, name: 'street', type: 'text' },
            { el: Input, name: 'suite', type: 'text' },
            { el: Input, name: 'city', type: 'text', required: true },
            { el: Select, name: 'state', enumMap: provinces, defaultValue: 'CA', required: true },
            { el: Select, name: 'country', enumMap: countries, defaultValue: 'US', required: true },
            { el: Input, name: 'postalCode', type: 'text', pattern: '^[0-9]{5}([- ]?[0-9]{4})?$|^[A-Z][0-9][A-Z][- ]?[0-9][A-Z][0-9]$' }
        ]
    },
    facility: {
        sorted: [
            ['selfStorage.name', false],
            ['address.city', false]
        ],
        headers: ['ID', 'Name', 'Storage', 'Address', 'Email', 'Phone'],
        columns: ['_id', 'name', 'selfStorage', 'address', 'email', 'phone'],
        row: (x: Facility) => [x._id.toHexString(), x.name, x.selfStorage?.name, DAL.address.row(x.address), x.email, x.phone],
        fields: [
            { el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true },
            { el: Output, name: 'name' },
            { el: Select, name: 'selfStorage', to: 'self-storage', optionMap: { value: '_id', label: 'name' } },
            { el: Fieldset, name: 'address' },
            { el: Input, type: 'email', name: 'email', label: 'E-mail' },
            { el: Input, type: 'tel', name: 'phone' }
        ]
    },
    length: {
        headers: [],
        columns: [ 'value', 'uom'],
        row: (x: any) => [],
        sorted: [],
        fields: [
            { el: Input, name: 'value', required: true, min: 0, defaultValue: '0' },
            { el: Select, name: 'uom', defaultValue: 'in', enumMap: lengths, required: true, label: 'Unit of Measure' }
        ]
    },
    'square-footage': {
        headers: [],
        columns: ['length', 'width'],
        row: (x: any) => [],
        sorted: [],
        fields: [
            { el: Fieldset, name: 'length' },
            { el: Fieldset, name: 'width' },
            { el: Output, name: 'displayAs' }
        ]
    },
    'rental-unit': {
        headers: [],
        columns: ['_id', 'facility', 'unit', 'size'],
        row: (x: any) => [],
        sorted: [
            ['facility.selfStorage.name', false],
            ['facility.address.city', false]
        ],
        fields: [
            { el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true },
            { el: Select, name: 'facility', to: 'facility', optionMap: { value: '_id', label: 'name' }, required: true },
            { el: Input, name: 'unit', required: true },
            { el: Fieldset, name: 'size' }
        ]
    }
};
