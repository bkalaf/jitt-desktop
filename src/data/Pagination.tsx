/* eslint-disable no-constant-condition */
import { useMemo } from 'react';
import React from 'react';
import { ObjectId } from 'bson';
import { DefinedType, TableCell } from './definitions';
import { Boundary } from '../components/grid/Boundary';
import { faCheckSquare, faSquare, faPenAlt, faTrashCan } from '@fortawesome/pro-duotone-svg-icons';
import { DuotoneButton } from '../components/providers/DuotoneBtn';
import { ignore } from '../common/ignore';
import { $cn } from '../util/$cn';
import { useSelectable } from '../hooks/useSelectable';
import { useMutation } from 'react-query';
import { Mutation } from '../queries';
import { useRealmMutation } from '../queries/useRealmMutation';

export type HeaderFunctionComponent = React.FunctionComponent<{ Definition: DefinedType; selectAll: () => void }>;

export type ImmutableRowComponent = React.FunctionComponent<{ Definition: DefinedType; index: number; row: Record<string, any> & Realm.Object }>;
export function ImmutableRow<T extends Record<string, any>>({ index, Definition, row }: { Definition: DefinedType; row: T & Realm.Object; index: number }) {
    const [_a, isSelected, onClick] = useSelectable();
    const [_b, _c, execute] = useRealmMutation(Mutation.deleteSelected, ignore);
    const spread = $cn(
        {},
        {
            selected: isSelected(index.toString())
        },
        'text-white border border-white even:bg-blue odd:bg-slate'
    );
    return (
        <tr data-oid={row._id?.toHexString()} data-id={index} {...spread} onClick={onClick} role='button'>
            <td className='min-w-[5rem] w-[5rem]'>
                <DuotoneButton
                    onClick={ignore}
                    primary='darkblue'
                    secondary={false ? 'forestgreen' : 'red'}
                    icon={false ? faCheckSquare : faSquare}
                    bg='bg-slate-very-dark'
                    size='lg'
                    secondaryOpacity={0.7}
                    title='Select this row.'
                    initState={false}
                />
            </td>
            <td className='min-w-[5rem] w-[5rem]'>
                <DuotoneButton
                    onClick={ignore}
                    title='Edit this row.'
                    initState={false}
                    icon={faPenAlt}
                    primary='red'
                    secondary='coral'
                    bg='bg-slate-very-dark'
                    size='lg'
                />
            </td>
            <Definition>{(p) => TableCell({ ...p, row: row as any })}</Definition>
            <td className='min-w-[5rem] w-[5rem]'>
                <DuotoneButton
                    onClick={() => {
                        alert(`would delete index: ${index}`);
                        execute([row._id.toHexString()]);
                    }}
                    title='Delete this row.'
                    initState={false}
                    icon={faTrashCan}
                    primary='mediumseagreen'
                    secondary='lawngreen'
                    secondaryOpacity={0.7}
                    bg='bg-slate-very-dark'
                    size='lg'
                />
            </td>
        </tr>
    );
}
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
