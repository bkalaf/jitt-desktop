/* eslint-disable no-constant-condition */
import React from 'react';
import { DefinedType, TableCell } from './definitions';
import { faCheckSquare, faSquare, faPenAlt, faTrashCan } from '@fortawesome/pro-duotone-svg-icons';
import { DuotoneButton } from '../components/providers/DuotoneBtn';
import { ignore } from '../common/ignore';
import { $cn } from '../util/$cn';
import { useSelectable } from '../hooks/useSelectable';
import { Mutation } from '../queries';
import { useRealmMutation } from '../queries/useRealmMutation';

export function ImmutableRow<T extends Record<string, any>>({ index, Definition, row }: { Definition: DefinedType; row: T & Realm.Object; index: number; }) {
    const [_a, isSelected, onClick] = useSelectable();
    const [_b, _c, execute] = useRealmMutation(Mutation.deleteSelected, ignore);
    const spread = $cn(
        {},
        {
            selected: isSelected(row._id.toHexString())
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
                    initState={false} />
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
                    size='lg' />
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
                    size='lg' />
            </td>
        </tr>
    );
}
