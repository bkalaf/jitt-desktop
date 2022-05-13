import { faKey, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { createContext, HTMLInputTypeAttribute } from 'react';
import { ObjectSchemaProperty } from 'realm';
import { isIn } from '../../common/array/isIn';
import { countries } from '../../data/enums/country';
import { lengths } from '../../data/enums/lengthUOM';
import { provinces } from '../../data/enums/province';
import { IEmbedded, IPrimitive, IRealmType, IType } from './IType';
import { fromKebabToCamelCase } from '../../common/text/fromKebabToCamelCase';

export const ORM: Record<
    string,
    {
        columns: {
            name: string;
            enum?: any;
            label?: string;
            local?: boolean;
            embedded?: boolean;
            to?: string;
            icon?: IconDefinition;
            displayAs?: boolean;
            option?: string[];
            readOnly?: boolean;
            autoGen?: boolean;
            inputType?: HTMLInputTypeAttribute;
            min?: number;
            pattern?: string;
        }[];
        descendants?: any[];
        sort?: string[];
        displayAs?: boolean;
    }
> = {
    address: {
        columns: [
            { name: 'suite' },
            { name: 'street' },
            { name: 'city' },
            { name: 'state', enum: provinces },
            { name: 'country', enum: countries },
            { name: 'postalCode', pattern: '^[0-9]{5}([- ]?[0-9]{4})?$|^[A-Z][0-9][A-Z][- ]?[0-9][A-Z][0-9]$' }
        ]
    },
    length: {
        columns: [
            { name: 'value', min: 0 },
            { name: 'uom', enum: lengths }
        ],
        displayAs: true
    },
    squareFootage: {
        columns: [{ name: 'length' }, { name: 'width' }],
        displayAs: true
    },
    selfStorage: {
        columns: [{ name: '_id', autoGen: true, label: 'ID', icon: faKey, readOnly: true }, { name: 'name' }, { name: 'website', inputType: 'url' }],
        descendants: [{ to: 'facility', on: 'facilities' }],
        sort: ['name']
    },
    facility: {
        columns: [
            { name: '_id', label: 'ID', autoGen: true, icon: faKey, readOnly: true },
            { name: 'name', local: true },
            { name: 'selfStorage', option: ['_id', 'name'] },
            { name: 'address', embedded: true },
            { name: 'facilityNumber' },
            { name: 'email', inputType: 'email' },
            { name: 'phone', inputType: 'tel' }
        ],
        descendants: [{ to: 'rental-unit', on: 'units' }],
        sort: ['selfStorage.name', 'address.city']
    },
    rentalUnit: {
        columns: [
            { name: '_id', label: 'ID', autoGen: true, icon: faKey, readOnly: true },
            { name: 'facility', option: ['_id', 'name'] },
            { name: 'unit' },
            { name: 'size', embedded: true, displayAs: true }
        ],
        sort: ['facility.selfStorage.name', 'unit']
    }
};


export type IPropertyInfo = {
    name: string;
    propertyType: 'primitive' | 'local' | 'reference' | 'embedded' | 'collection';
    index: number;
    label: string;
    type: string;
    objectType?: string;
    property?: string;
    optional: boolean;
    enumMap?: Record<string, string>;
    option?: string[];
    icon?: IconDefinition;
    displayAs?: boolean;
    parentTypes?: string[];
    embedded?: boolean;
    readOnly?: boolean;
    required?: boolean;
    props: React.HTMLAttributes<DataElement>;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    multiple?: boolean;
    size?: number;
    inputType?: HTMLInputTypeAttribute;
    validators?: Array<(x: any) => boolean | string>;
    deserialize?: (x: string) => any;
    serialize?: (x: any) => string;
    local?: boolean;
};
export type ITypeInfo = {
    name: string;
    embedded: boolean;
    properties: Record<string, IPropertyInfo | null>;
    sort: string[];
};
export type FieldType =
    | 'short-text'
    | 'long-text'
    | 'integer'
    | 'floating-point'
    | 'boolean'
    | 'fixed-choice-few'
    | 'fixed-choice-many'
    | 'reference-choice'
    | 'list'
    | 'date-time'
    | 'date'
    | 'binary'
    | 'id'
    | 'guid'
    | 'range'
    | 'local';

// export interface PropertyInfo {
//     name: string;
//     dataType: DataTypeInfo;
//     fieldType: FieldType;
//     isEmbedded: boolean;
//     isLocal: boolean;
//     isReference: boolean;
//     isPrimitive: boolean;
//     isDataStructure: boolean;

// }
export interface Descendant {
    to: string;
    on: string;
}
// export interface TypeInfo {
//     name: string;
//     isEmbedded: boolean;
//     properties: Record<string, PropertyInfo>;
//     sort: SortDescriptor[];
//     descendants: Descendant[];
// }
const isEmbeddedDisplayAs = function <T>(oc: RealmClass<T>) {
    return (x: IRealmType) => Type.isEmbedded(x) && Object.getOwnPropertyNames(Object.getPrototypeOf(oc)).includes('displayAs');
};
const isEmbedded = (x: IRealmType): x is IEmbedded & IType => x.propertyType === 'embedded';
export const Type = {
    isPrimitive: (x: IRealmType) => x.propertyType === 'primitive',
    isLocal: (x: IRealmType) => x.propertyType === 'local',
    isReference: (x: IRealmType) => x.propertyType === 'reference',
    isList: (x: IRealmType) => x.propertyType === 'collection',
    isEmbedded,
    isAutoGenerated: (x: IRealmType) => x.propertyType === 'primitive' && x.autoGen,
    isSelect: (x: IRealmType) => x.propertyType === 'reference',
    isEmbeddedNotDisplayAs: (x: IRealmType) => isEmbedded(x) && !(x.displayAs ?? false)
};

export type ISchemaContext = {
    types: Record<string, ITypeInfo> | null;
    getType(name: string): ITypeInfo | null;
    getProperty(name: string, property: string): IPropertyInfo | null;
    getObjectClass<T>(name: string): RealmClass<T> | null;
    getColumns(name: string): [string, IPropertyInfo | null][] | null;
    getControls(name: string): [string, IPropertyInfo | null][] | null;
};

export const SchemaContext = createContext<ISchemaContext | undefined>(undefined);

export function createProps(name: string, v: IPropertyInfo | null) {
    const props = {
        required: !(v?.optional ?? false),
        readOnly: (v?.readOnly ?? false) || (v?.local ?? false),
        minLength: v?.minLength,
        maxLength: v?.maxLength,
        min: v?.min,
        max: v?.max,
        pattern: v?.pattern,
        multiple: v?.multiple,
        size: v?.size,
        type: v?.inputType,
        validators: v?.validators,
        serialize: v?.serialize || (v?.displayAs ? (x: any) => x.displayAs : undefined),
        deserialize: v?.deserialize,
        label: v?.label
    };
    Object.getOwnPropertyNames(props).forEach((k) => {
        if ((props as any)[k] == null) {
            delete (props as any)[k];
        }
    });
    return props;
}
export function SchemaProvider({ children }: { children: Children }) {
    const value = undefined
    return <SchemaContext.Provider value={value}>{children}</SchemaContext.Provider>;
}
