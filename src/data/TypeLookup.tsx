import Realm, { PropertiesTypes, PropertyType, SortDescriptor } from 'realm';
import { Children } from 'react';
import { toTitleCase } from '../common';
import { TableHeadCell } from './TableHeadCell';
import { fst } from '../common/tuple/fst';
import React from 'react';
import { isNotNil } from '../common/isNotNull';
import { ObjectId } from 'bson';
import { Storages } from '.';
import { HeaderFunctionComponent, ImmutableRowComponent } from './Pagination';
import { DefinedType } from './definitions';

const $selfStorage = ['name', 'website', 'facilities'];
const $selfStorageColumns = ['_id', ...$selfStorage];

export const StandardHeader = TableHeadCell('bg-slate-dark');
export const EntityHeader = TableHeadCell('bg-teal-dark');

// export function GridImmutableRow() {

// }

// export function toControlSet({ partial, replace }: { partial: string[]; replace?: Record<number, string> }) {
//     return function ControlSet({ children }: { children: React.ReactNode }) {
//         const columns = useMemo(() => calculateColumnList(partial, ...Object.entries(replace ?? {})), []);
//         console.log(`columns: `, columns);
//         const controls = columns.map(fst).map(name => React.Children.toArray(children).find(el => {
//             return (el as JSX.Element).props.name === name;
//         }));
//         if (controls.some(isNotNil)) throw new Error('Control was null.');

//     }
// }

export interface IViewProps<T extends { _id: ObjectId } = { _id: ObjectId }> {
    HeaderComponent: HeaderFunctionComponent;
    ImmutableRowComponent: ImmutableRowComponent;
    MutableRowComponent: React.FunctionComponent<{
        row: T;
        columnList: string[];
        controls: React.FunctionComponent<{ columnList: string[]; headerList: string[] }>;
    }>;
    InsertControlsComponent: React.FunctionComponent<{ columnList: string[]; headerList: string[] }>;
    EditControlsComponent: React.FunctionComponent<{ columnList: string[]; headerList: string[] }>;
    data: () => Realm.Results<T>;
    Definitions: DefinedType;
    columnList: string[];
    sort?: SortDescriptor[];
}



export type TypeKey = 'backlink' | 'primitive' | 'embedded' | 'reference' | 'many' | 'local';

export type Type = [
    key: TypeKey,
    type: string,
    properties?: [propName: string, propertyType?: Type][] | undefined,
    descriptor?: PropertyDescriptor | undefined,
    recursive?: Type | undefined
];

// export function ofPropertys(typeMap: Record<string, { embedded: boolean; properties: PropertiesTypes }>, realm: Realm, typeName: string) {
//     return (properties: PropertiesTypes): [string, Type][] => {
//         return Object.entries(properties).map(([k, v]) => {
//             const { type, objectType } = v as ObjectSchemaProperty;
//             return [k, toType(typeMap, realm, typeName)(type, objectType, k)];
//         });
//     };
// }
export const objectClasses = [Storages.Address, Storages.Facility, Storages.RentalUnit, Storages.SelfStorage, Storages.SquareFootage];
