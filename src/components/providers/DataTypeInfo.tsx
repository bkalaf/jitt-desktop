import { ObjectSchemaProperty, SortDescriptor, UserIdentity } from 'realm';
import { identity } from '../../common/identity';
import { padZero } from '../../common/text/padZero';
import { composeR } from '../../common/composeR';
import { ObjectId } from 'bson';
import { createContext, FieldsetHTMLAttributes, HTMLInputTypeAttribute, OlHTMLAttributes, TdHTMLAttributes, useCallback, useRef, useState } from 'react';
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { Descendant, ORM } from './SchemaProvider';
import { useRealm } from '../../hooks/useRealm';
import { fst } from '../../common/fst';
import { Output } from '../forms/elements/Output';
import { Select } from '../forms/elements/Select';
import { Input } from '../forms/elements/Input';
import { icon } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const toOutput: Record<string, (x: any) => string> = {
    objectId: (x: ObjectId) => x.toHexString(),
    string: identity,
    int: (x: number) => x.toFixed(0),
    float: (x: number) => x.toFixed(4),
    double: (x: number) => x.toFixed(2),
    decimal128: (x: number) => x.toString(),
    boolean: (x: boolean) => (x ? 'true' : 'false'),
    date: (x: Date) =>
        [
            [padZero(2)(x.getMonth() + 1), padZero(2)(x.getDate()), x.getFullYear()].join('/'),
            [
                [padZero(2)(x.getHours() === 0 ? 12 : x.getHours() > 13 ? x.getHours() - 12 : x.getHours()), padZero(2)(x.getMinutes())].join(':'),
                x.getHours() >= 12 ? 'PM' : 'AM'
            ].join(' ')
        ].join(' '),
    data: (x: ArrayBuffer) => {
        const reader = new FileReader();
        reader.readAsDataURL(new Blob([x]));
        return (reader.result as string) ?? '';
    }
};
export const toDB: Record<string, (x: string) => any> = {
    objectId: (x: string) => new ObjectId(x),
    int: (x: string) => parseInt(x, 10),
    float: (x: string) => parseFloat(x),
    double: (x: string) => parseFloat(x),
    decimal128: (x: string) => parseFloat(x),
    boolean: (x: string) => x === 'true',
    string: identity,
    date: (x: string) => new Date(Date.parse(x)),
    data: async (x: string) => new Blob([x]).arrayBuffer()
};
export interface DataTypeInfo {
    type: string;
    objectType?: string;
    property?: string;
    optional: boolean;
    indexed: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    inputType: HTMLInputTypeAttribute;
    name: string;
    dataType: DataTypeInfo;
}
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    enumMap?: Record<string, string>;
    name: string;

    dataType: DataTypeInfo;
}
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string;
    dataType: DataTypeInfo;
}
export interface OutputProps extends React.OutputHTMLAttributes<HTMLOutputElement> {
    name: string;
    dataType: DataTypeInfo;
}
export interface FieldSetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
    name: string;
    dataType: DataTypeInfo;
}
export type ControlProps = FieldSetProps | OutputProps | TextAreaProps | InputProps | SelectProps;
export interface CellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    icon?: IconDefinition;
    displayAs?: string;
    name: string;
    dataType: DataTypeInfo;
}
export interface PropertyInfo {
    dataType: DataTypeInfo;
    name: string;
    Control: <T extends React.HTMLAttributes<HTMLElement>>(x: T) => JSX.Element;
    Cell: (x: CellProps) => JSX.Element;
    props: any;
}
export interface TypeInfo {
    name: string;
    sort?: SortDescriptor[];
    descendants?: Descendant[];
    properties?: Record<string, PropertyInfo>;
}

export function useQueue<T>(init: T[] = []) {
    const [queue, setQueue] = useState<T[]>(init);
    const next = useRef<T | undefined>(undefined);
    const enqueue = useCallback((item: T) => {
        setQueue((prev) => [...prev, item]);
    }, []);
    const dequeue = useCallback(function* () {
        setQueue((prev) => {
            if (prev.length > 0) {
                const [head, ...tail] = prev;
                next.current = head;
                return tail;
            }
            return [];
        });
        yield next.current;
    }, []);
    return [enqueue, dequeue];
}
export function useProvideMetaData() {
    const realm = useRealm();
    const findRealmSchema = (x: string, t: string) => realm?.schema.find((y) => y.name === x)?.properties[t] as ObjectSchemaProperty;
    const ormTypes = Object.fromEntries(
        Object.entries(ORM).map(([typeName, { columns, descendants, sort, displayAs }]) => [
            typeName,
            {
                sort,
                descendants,
                displayAs,
                properties: Object.fromEntries(
                    columns.map(
                        ({
                            name,
                            autoGen,
                            displayAs: fieldDisplayAs,
                            embedded,
                            enum: enumMap,
                            icon,
                            inputType,
                            label,
                            local,
                            min,
                            option,
                            pattern,
                            readOnly,
                            to
                        }) => {
                            const { optional, indexed, property, objectType, type } = findRealmSchema(typeName, name) ?? {};
                            return [
                                name,
                                {
                                    name,
                                    dataType: {
                                        type: type,
                                        objectType: objectType,
                                        indexed: indexed ?? false,
                                        optional: optional ?? false,
                                        property: property
                                    },
                                    props: {
                                        autoGen,
                                        inputType,
                                        label,
                                        local,
                                        min,
                                        option,
                                        pattern,
                                        readOnly,
                                        to,
                                        enumMap,
                                        embedded,
                                        displayAs: fieldDisplayAs ?? displayAs
                                    },
                                    Control:
                                        property != null
                                            ? Select
                                            : objectType != null && type === 'object' && fieldDisplayAs == null
                                            ? FieldSet
                                            : objectType != null && type === 'object'
                                            ? Input
                                            : objectType != null
                                            ? ListElement
                                            : type == null
                                            ? Output
                                            : Input,
                                    Cell: icon ? (IconCell as any) : TableCell
                                }
                            ];
                        }
                    ) as [string, PropertyInfo][]
                )
            }
        ])
    );
    return {
        types: ormTypes,
        getType: (x: string) => ormTypes[x],
        getProperty: (x: string, t: string) => ormTypes[x].properties[t],
        getObjectClass: (x: string) => realm?.schema.find((y) => y.name === x),
        getSort: (x: string) => ormTypes[x].sort
    };
}

export function ListElement(props: OlHTMLAttributes<HTMLOListElement>) {
    return <ol {...props}></ol>;
}
export function FieldSet(props: FieldsetHTMLAttributes<HTMLFieldSetElement>) {
    return <fieldset {...props} />;
}
export function IconCell(props: TdHTMLAttributes<HTMLTableCellElement> & { icon: IconDefinition; children: string }) {
    return (
        <td {...props} title={props.children}>
            <FontAwesomeIcon icon={props.icon} size='lg' />
        </td>
    );
}
export function TableCell(props: TdHTMLAttributes<HTMLTableCellElement>) {
    return <td {...props}></td>;
}

export const MetaDataContext = createContext<ReturnType<typeof useProvideMetaData> | undefined>(undefined);

export function MetaDataProvider({ children }: { children: Children }) {
    const value = useProvideMetaData();
    console.log(value);
    return <MetaDataContext.Provider value={value}>{children}</MetaDataContext.Provider>;
}
