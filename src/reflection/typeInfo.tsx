import { stringify } from 'querystring';
import { Storages } from '../data';
import { countries, provinces } from '../data/enums';
import { runInThisContext } from 'vm';
import { IField } from './IField';
import { Field } from './Field';

export const objectClasses = [Storages.Address, Storages.Facility, Storages.RentalUnit, Storages.SelfStorage, Storages.SquareFootage];

export const valueType = 'value-type';
export const complexType = 'complex-type';
export const listType = 'list-type';

export type TypeKind = typeof valueType | typeof complexType | typeof listType;
export type ListKind = 'list' | 'dictionary' | 'set' | 'linkingObjects';

export interface IValueType {
    kind: 'value-type';
    name: string;
}
export interface IComplexType {
    kind: 'complex-type';
    name: string;
    embedded: boolean;
    fields: Record<string, IField>;
}
export interface IListType {
    kind: 'list-type';
    name: string;
    listType: ListKind;
}

export type Types = IListType | IComplexType | IValueType;

export function infoCtor(kind: 'value-type', name: string): IValueType {
    return { kind, name };
}
export function infoCtor2(kind: 'complex-type', name: string, embedded: boolean, ...fields: IField[]): IComplexType {
    return { kind, name, embedded, fields: Object.fromEntries(fields.map((x) => [x.name, x])) };
}
export function infoCtor3(kind: 'list-type', name: string, listType: 'list' | 'set' | 'dictionary' | 'linkingObjects'): IListType {
    return { kind, name, listType };
}