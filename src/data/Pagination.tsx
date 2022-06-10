/* eslint-disable no-constant-condition */
import { useMemo } from 'react';
import React from 'react';
import { ObjectId } from 'bson';
import { DefinedType } from './definitions';
import { Boundary } from '../components/grid/Boundary';
import { useMutation } from 'react-query';

export type HeaderFunctionComponent = React.FunctionComponent<{ Definition: DefinedType; selectAll: () => void }>;

export type ImmutableRowComponent = React.FunctionComponent<{ Definition: DefinedType; index: number; row: Record<string, any> & Realm.Object }>;
export interface IPaginationProps<T extends { _id: ObjectId } = { _id: ObjectId }> {
    data: Realm.Results<T>;
    editableRow?: string;
    columnList: string[];
    ImmutableRowComponent: ImmutableRowComponent;
    MutableRowComponent: React.FunctionComponent<{
        row: T;
        columnList: string[];
        controls: React.FunctionComponent<{ columnList: string[]; headerList: string[] }>;
    }>;
    Definition: DefinedType;
    start: number;
    end: number;
    EditControlsComponent: React.FunctionComponent<{ columnList: string[]; headerList: string[] }>;
}

export function Pagination<T extends { _id: ObjectId } = { _id: ObjectId }>({
    data,
    editableRow,
    MutableRowComponent,
    ImmutableRowComponent,
    EditControlsComponent,
    columnList,
    Definition,
    start,
    end
}: IPaginationProps<T>) {
    const window = useMemo(() => data.slice(start, end + 1), [data, end, start]);
    console.log('window', window);
    return (
        <Boundary>
            <tbody>
                {window.map((row: any, ix: number) => {
                    return row._id.toHexString() === editableRow ? (
                        <MutableRowComponent row={row} columnList={columnList} controls={EditControlsComponent} />
                    ) : (
                        <ImmutableRowComponent index={start + ix} row={row} Definition={Definition} />
                    );
                })}
            </tbody>
        </Boundary>
    );
}
