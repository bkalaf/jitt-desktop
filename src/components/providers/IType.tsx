import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { HTMLInputTypeAttribute } from 'react';
import { RealmTypes } from '../MainRouter';

export type TypeControls = 'input' | 'select' | 'radio' | 'textarea' | 'output' | 'list' | 'hidden' | 'fieldset';

export type TypeCells = 'text' | 'icon';
/**
 * @deprecated
 */
export type IType = {
    name: string;
    index: number;
    label: string;
    optional: boolean;
    indexed: boolean;
    validators: Array<(x: any) => boolean | string>;
    control: TypeControls;
    cell: TypeCells;
};
/**
 * @deprecated
 */
export type IPrimitive<T> = {
    propertyType: 'primitive';
    type: Exclude<RealmTypes, 'dictionary' | 'set' | 'list'>;
    serialize?: (s: T) => string;
    deserialize?: (s: string) => T | Promise<T> | undefined;
    icon?: IconDefinition;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    autoGen?: boolean;
    inputType?: HTMLInputTypeAttribute;
    enumMap?: Record<string, string>;
    pattern?: string;
    min?: number;
    max?: number;
    maxLength?: number;
    minLength?: number;
};
export type IReference = {
    propertyType: 'reference';
    type: 'object';
    objectType: string;
    embedded: false;
    option: [string, string];
    enumMap?: Record<string, string>;
    control: 'select';
};
export type IEmbedded = {
    propertyType: 'embedded';
    type: 'object';
    objectType: string;
    embedded: true;
    displayAs?: boolean;
    parentTypes: string[];
    control: 'fieldset';
};
export type ILocal = {
    propertyType: 'local';
    type: RealmTypes;
    local: true;
    control: 'output';
};
export type IDataSet = {
    propertyType: 'collection';
    type: 'list' | 'dictionary' | 'set';
    objectType: string;
    control: 'list' | 'select';
};

export type IRealmType = (
    | IPrimitive<string | number | boolean | ArrayBuffer | Date | Realm.BSON.ObjectId | Realm.BSON.UUID | null | undefined>
    | IReference
    | IEmbedded
    | ILocal
    | IDataSet
) &
    IType;
