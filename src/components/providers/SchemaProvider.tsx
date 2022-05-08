import { faKey, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { createContext, HTMLInputTypeAttribute } from 'react';
import { ObjectSchemaProperty } from 'realm';
import { isIn } from '../../common/array/isIn';
import { identity } from '../../common/identity';
import { countries } from '../../data/enums/country';
import { lengths } from '../../data/enums/lengthUOM';
import { provinces } from '../../data/enums/province';
import { useProvideSchemaContext } from '../../hooks/useProvideSchemaContext';
import { padZero } from '../../common/text/padZero';
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

// export const ORM = {
//     address: {
//         columns: [
//             colTypes(0, 'street').string,
//             colTypes(1, 'suite').string,
//             colTypes(2, 'city').string,
//             colTypes(3, 'state').string,
//             colTypes(4, 'country').string,
//             { ...colTypes(5, 'postalCode'), pattern: '^[0-9]{5}([- ]?[0-9]{4})?$|^[A-Z][0-9][A-Z][- ]?[0-9][A-Z][0-9]$' }
//         ]
//     },
//     length: {
//         columns: [
//             colTypes(0, 'value'),
//             { name: 'uom', enum: lengths }
//         ],
//         displayAs: true
//     },
//     squareFootage: {
//         columns: [{ name: 'length' }, { name: 'width' }],
//         displayAs: true
//     },
//     selfStorage: {
//         columns: [
//             { name: '_id', autoGen: true, label: 'ID', icon: faKey, readOnly: true },
//             { name: 'name' },
//             { name: 'website', inputType: 'url' }
//         ],
//         descendants: [{ to: 'facility', on: 'facilities' }],
//         sort: ['name']
//     },
//     facility: {
//         columns: [
//             { name: '_id', label: 'ID', autoGen: true, icon: faKey, readOnly: true },
//             { name: 'name', local: true },
//             { name: 'selfStorage', option: ['_id', 'name'] },
//             { name: 'address', embedded: true },
//             { name: 'facilityNumber' },
//             { name: 'email', inputType: 'email' },
//             { name: 'phone', inputType: 'tel' }
//         ],
//         descendants: [{ to: 'rental-unit', on: 'units' }],
//         sort: ['selfStorage.name', 'address.city']
//     },
//     rentalUnit: {
//         columns: [
//             { name: '_id', label: 'ID', autoGen: true, icon: faKey, readOnly: true },
//             { name: 'facility', option: ['_id', 'name'] },
//             { name: 'unit' },
//             { name: 'size', embedded: true, displayAs: true }
//         ],
//         sort: ['facility.selfStorage.name', 'unit']
//     }
// };
export const stringPrimitive: IPrimitive<string> = {
    propertyType: 'primitive',
    type: 'string',
    serialize: identity,
    deserialize: identity,
    inputType: 'text'
};

export const intPrimitive: IPrimitive<number> = {
    propertyType: 'primitive',
    type: 'int',
    serialize: (x: number) => x.toFixed(0),
    deserialize: (s: string) => parseInt(s, 10),
    inputType: 'number'
};
const floatingPrimitive: (type: 'double' | 'float' | 'decimal128') => (precision?: number) => IPrimitive<number> =
    (type: 'double' | 'float' | 'decimal128') =>
    (precision = 2) => ({
        propertyType: 'primitive',
        type: type,
        serialize: (x: number) => x.toFixed(precision),
        deserialize: (x: string) => parseFloat(x)
    });
export const doublePrimitive = floatingPrimitive('double');
export const floatPrimitive = floatingPrimitive('float');
export const decimal128Primitive = floatingPrimitive('decimal128');
export const boolPrimitive: IPrimitive<boolean> = {
    propertyType: 'primitive',
    type: 'bool',
    serialize: (s: boolean) => (s ? 'true' : 'false'),
    deserialize: (s: string) => s === 'true',
    inputType: 'checkbox'
};
export const objectIdPrimitive: IPrimitive<Realm.BSON.ObjectId> = {
    propertyType: 'primitive',
    type: 'objectId',
    serialize: (x: Realm.BSON.ObjectId) => x.toHexString(),
    deserialize: (s: string) => new Realm.BSON.ObjectId(s),
    autoGen: true,
    readOnly: true,
    required: true,
    icon: faKey
};
export const datePrimitive: IPrimitive<Date> = {
    propertyType: 'primitive',
    type: 'date',
    serialize: (x: Date) =>
        [
            [padZero(2)(x.getMonth() + 1), padZero(2)(x.getDate()), x.getFullYear()].join('/'),
            [
                [padZero(2)(x.getHours() === 0 ? 12 : x.getHours() > 13 ? x.getHours() - 12 : x.getHours()), padZero(2)(x.getMinutes())].join(':'),
                x.getHours() >= 12 ? 'PM' : 'AM'
            ].join(' ')
        ].join(' '),
    deserialize: (x: string) => new Date(Date.parse(x)),
    inputType: 'date'
};
export const dataPrimitive: IPrimitive<ArrayBuffer> = {
    propertyType: 'primitive',
    type: 'data',
    serialize: (x: ArrayBuffer) => {
        const reader = new FileReader();
        reader.readAsDataURL(new Blob([x]));
        return (reader.result as string) ?? '';
    },
    deserialize: async (x: string) => {
        return await new Blob([x]).arrayBuffer();
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

export function toTypeInfo(name: string, properties: [string, ObjectSchemaProperty][], embedded: boolean): ITypeInfo {
    const orm = ORM[fromKebabToCamelCase(name)];
    const columns = orm.columns
        .map((x, ix) => ({ ...x, ...(properties.find(([k, v]) => fromKebabToCamelCase(k) === x.name) ?? [x.name, {}])[1], index: ix }))
        .map((x) => ({
            ...x,
            propertyType: x.embedded
                ? 'embedded'
                : x.local
                ? 'local'
                : x.to != null
                ? 'reference'
                : isIn(['list', 'dictionary', 'set'])(x.type ?? '')
                ? 'collection'
                : 'primitive'
        }));
    return {
        name,
        properties: Object.fromEntries(columns.map((x) => [x.name, x])) as Record<string, IPropertyInfo>,
        embedded,
        sort: orm.sort ?? []
    };
}
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
    const value = useProvideSchemaContext();
    return <SchemaContext.Provider value={value}>{children}</SchemaContext.Provider>;
}
