import { faKey, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { HTMLInputTypeAttribute } from 'react';
import { ObjectClass, SortDescriptor } from 'realm';
import { Address, Facility, mongo, SelfStorage } from '../../data';
import { countries } from '../../data/enums/country';
import { lengths } from '../../data/enums/lengthUOM';
import { provinces } from '../../data/enums/province';
import { Fieldset } from '../forms/elements/Fieldset';
import { FormElement, Input } from '../forms/elements/Input';
import { Output } from '../forms/elements/Output';
import { Select } from '../forms/elements/Select';
import { IFieldInfo } from "../../types/metadata/IFieldInfo";
import { auctionSites } from '../../data/enums/auctionSite';
import { mimeTypes } from '../../data/enums/mimeTypes';

export type ColumnScope = [string, string | undefined];

export const DAL: Record<
    string,
    {
        // headers: string[];
        columns: string[];
        // row: (x: any) => Array<string | undefined | Array<any>>;
        sorted: SortDescriptor[];
        fields: IFieldInfo[];
    }
> = {
    'self-storage': {
        sorted: [['name', false]],
        // headers: ['ID', 'Name', 'Website'],
        columns: ['_id', 'name', 'website'],
        // row: (x: SelfStorage) => [x._id.toHexString(), x.name, x.website],
        fields: [
            { el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true },
            { el: Input, name: 'name', required: true, minLength: 5, type: 'text' },
            { el: Input, name: 'website', type: 'url' }
        ]
    },
    address: {
        sorted: [],
        // headers: ['Street', 'Suite', 'City', 'State/Province', 'Country', 'Postal/Zip Code'],
        columns: ['street', 'suite', 'city', 'state', 'country', 'postalCode'],
        // row: (x: Address) => [x.street, x.suite, x.city, provinces[x.state], countries[x.country], x.postalCode],
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
        // headers: ['ID', 'Name', 'Storage', 'Address', 'Email', 'Phone'],
        columns: ['_id', 'name', 'selfStorage', 'address', 'email', 'phone'],
        // row: (x: Facility) => [x._id.toHexString(), x.name, x.selfStorage?.name, DAL.address.row(x.address), x.email, x.phone],
        fields: [
            { el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true },
            { el: Output, name: 'name' },
            { el: Select, name: 'selfStorage', to: 'self-storage', optionMap: { value: '_id', label: 'name' } },
            { el: Fieldset, name: 'address' },
            { el: Input, type: 'email', name: 'email', label: 'E-mail' },
            { el: Input, type: 'tel', name: 'phone' },
            { el: Input, type: 'text', name: 'facilityNumber' }
        ]
    },
    [mongo.length]: {
        columns: [ 'value', 'uom'],
        sorted: [],
        fields: [
            { el: Input, name: 'value', required: true, min: 0, defaultValue: '0', type: 'text' },
            { el: Select, name: 'uom', defaultValue: 'in', enumMap: lengths, required: true, label: 'Unit of Measure' }
        ]
    },
    [mongo.squareFootage]: {
        columns: ['length', 'width'],
        sorted: [],
        fields: [
            { el: Fieldset, name: 'length', asDisplay: true },
            { el: Fieldset, name: 'width', asDisplay: true },
            { el: Output, name: 'displayAs' }
        ]
    },
    [mongo.rentalUnit]: {
        columns: ['_id', 'name', 'facility', 'unit', 'size'],
        sorted: [
            ['facility.selfStorage.name', false],
            ['facility.address.city', false]
        ],
        fields: [
            { el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true },
            { el: Output, name: 'name' },
            { el: Select, name: 'facility', to: 'facility', optionMap: { value: '_id', label: 'name' } },
            { el: Input, name: 'unit', required: true, type: 'text' },
            { el: Fieldset, name: 'size', asDisplay: true }
        ]
    },
    [mongo.cost]: {
        sorted: [],
        columns: ['bid', 'taxPercent', 'taxDollar', 'taxExempt', 'premiumPercent', 'premiumDollar', 'totalDollar'],
        fields: [
            { el: Input, name: 'bid', min: 0, type: 'number', required: true },
            { el: Input, name: 'taxPercent', min: 0, max: 100, type: 'number', required: true },
            { el: Input, name: 'taxExempt', type: 'checkbox', required: true },
            { el: Input, name: 'premiumPercent', min: 0, max: 100, type: 'number', required: true },
            { el: Output, name: 'taxDollar' },
            { el: Output, name: 'premiumDollar' },
            { el: Output, name: 'totalDollar' },
        ]
    },
    [mongo.purchase]: {
        sorted: [['closeDate', false]],
        columns: ['_id', 'rentalUnit', 'closeDate', 'auctionSite', 'auctionId', 'invoiceId', 'invoice', 'cost'],
        fields: [
            { el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true },
            { el: Select, name: 'rentalUnit', optionMap: { value: '_id', label: 'name' }, to: mongo.rentalUnit },
            { el: Input, name: 'closeDate', type: 'date', required: true },
            { el: Select, name: 'auctionSite', enumMap: auctionSites, required: true },
            { el: Input, name: 'auctionId', type: 'text' },
            { el: Input, name: 'invoiceId', type: 'text' },
            { el: Select, name: 'invoice', optionMap: { value: '_id', label: 'name' }, to: mongo.fsItem },
            { el: Fieldset, name: 'cost' }
        ]
    },
    [mongo.fsItem]: {
        sorted: [['fsAlloc.materializedPath', false]],
        columns: ['_id', 'fsAlloc', 'data', 'size', 'mimeType', 'invoice', 'name', 'isAssigned', 'isInvoice'],
        fields: [
            { el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true },
            { el: Select, name: 'fsAlloc', hideOnInsert: true },
            { el: Input, name: 'data', type: 'image' },
            { el: Input, name: 'size', type: 'number', required: true },
            { el: Select, name: 'mimeType', enumMap: mimeTypes },
            { el: Select, name: 'invoice', hideOnInsert: true },
            { el: Output, name: 'name' },
            { el: Output, name: 'isAssigned' },
            { el: Output, name: 'isInvoice' }
        ]
    },
    [mongo.fsAlloc]: {
        sorted: [['materializedPath', false]],
        columns: ['_id', 'name', 'originalName', 'parent', 'content', 'materializedPath', 'fsItem', 'fileCreation', 'count', 'path', 'isFolder', 'isFile', 'size'],
        fields: [
            { el: Input, name: '_id', readOnly: true, required: true, type: 'text', icon: faKey, label: 'ID', hideOnInsert: true },
            { el: Input, name: 'name', type: 'text', required: true},
            { el: Input, name: 'originalName', type: 'text', readOnly: true, required: true },
            { el: Select, name: 'parent', to: mongo.fsAlloc, optionMap: { value: '_id', label: 'materializedPath' }  },
            { el: Input, name: 'materializedPath', readOnly: true },
            { el: Select, name: 'fsItem', to: mongo.fsItem, optionMap: {
                value: '_id', label: 'name'
            }},
            { el: Input, name: 'fileCreation', type: 'date' },
            { el: Input, name: 'count', type:'number'},
            { el: Output, name: 'path' },
            { el: Output, name: 'isFile' },
            { el: Output, name: 'isFolder'}
        ]
    }
};
