/* eslint-disable dot-notation */
import { faPenAlt, faSquare, faTrashCan } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useMemo } from 'react';
import { ObjectSchemaProperty } from 'realm';
import { $cn } from '../util/$cn';
import { distinct } from '../common/array/distinct';
import { identity } from '../common/identity';
import { ignore } from '../common/ignore';
import { toTitleCase } from '../common/text/toTitleCase';
import { Control } from '../components/forms/Control';
import { FormEl } from '../components/forms/elements/Input';
import { DAL } from '../components/providers/DAL';
import { toDB, toOutput } from '../components/providers/DataTypeInfo';
import { getProperty } from '../common/obj/getProperty';
import { HeaderDef } from '../components/grid/HeaderDef';
import { objectFilter } from '../common/obj/objectFilter';
import { PropertyData } from '../components/grid/PropertyData';
import { useConfigSchema } from './useConfigSchema';
import React from 'react';
import { SelectButtonCell } from '../components/grid/SelectButtonCell';

function toField(typeLookup: Map<string, { typeName: string; embedded?: boolean }>, osp: ObjectSchemaProperty) {
    return [
        osp.mapTo,
        osp.objectType ?? osp.type,
        {
            local: false,
            optional: osp.optional ?? true,
            linkingObjects: osp.property != null,
            embedded: osp.type === 'object' && (typeLookup.get(osp.objectType ?? '')?.embedded ?? false),
            reference: osp.type === 'object' && (!typeLookup.get(osp.objectType ?? '')?.embedded ?? false),
            collection: osp.objectType != null && osp.property == null && osp.type !== 'object',
            primitive: osp.objectType == null
        }
    ] as [string, string, Record<'reference' | 'collection' | 'primitive' | 'embedded' | 'linkingObjects' | 'optional' | 'local', boolean>];
}
export type PropertyMap = Map<
    string,
    [string, string, Record<'reference' | 'collection' | 'primitive' | 'embedded' | 'linkingObjects' | 'optional' | 'local', boolean>]
>;
function toType(os: Realm.ObjectSchema[]) {
    const typeLookup = new Map(os.map((x) => [x.name, { typeName: x.name, embedded: x.embedded }]));

    const t = Object.fromEntries(
        os.map((x) => [
            x.name,
            {
                typeName: x.name,
                embedded: x.embedded,
                fields: Object.fromEntries(
                    Object.entries(x.properties).map(([k, v]) => [
                        k,
                        {
                            name: k,
                            mappedTo: toField(typeLookup, v as any)[0],
                            type: toField(typeLookup, v as any)[1],
                            toDB: toDB[toField(typeLookup, v as any)[1]],
                            fromDB: toOutput[toField(typeLookup, v as any)[1]],
                            ...toField(typeLookup, v as any)[2]
                        }
                    ])
                )
            }
        ])
    );
    return t;
}

export type RowComponent = (props: {
    data?: any;
    selectClick: (ev: React.MouseEvent<HTMLElement>) => void;
    deleteClick: (ev: React.MouseEvent<HTMLElement>) => void;
    deleteEnabled: (oid: string) => boolean;
    isSelected: (oid: string) => boolean;
    onClick: (ev: React.MouseEvent<HTMLElement>) => void;
}) => JSX.Element;

export function useDAL(collection: string) {
    const dal = useMemo(() => DAL[collection], [collection]);
    const getLabel = (x: string) => dal.fields.find((a) => a.name === x)?.label;
    const configSchema = useConfigSchema();
    const typeMap = toType(configSchema);
    const getFieldFromType = useCallback(
        (typeName: string, fieldName: string): PropertyData => {
            console.log(`typeName`, typeName, `fieldName`, fieldName);
            return ((typeMap[typeName] ?? { fields: {} }).fields ?? {})[fieldName] ?? { name: fieldName, local: true };
        },
        [typeMap]
    );
    const embeddedFieldsOnType = (x: string) => Object.getOwnPropertyNames(objectFilter(typeMap[x]?.fields)((x) => x.embedded));
    // const insertColumns = dal.columns.filter((x) => !linkingObjectsOnType(collection).includes(x));
    const heads: HeaderDef[] = useMemo(
        () =>
            dal.columns
                .map((x) =>
                    embeddedFieldsOnType(collection).includes(x)
                        ? DAL[getFieldFromType(collection, x).type].columns.map((a) => ({ group: x, header: a }))
                        : [{ header: getLabel(x) ?? x }]
                )
                .reduce((pv, cv) => [...pv, ...cv], []),
        []
    );
    const isColGroups = heads.some((x) => x.group != null);
    const justGroups = heads.filter((x) => x.group != null).map((x) => x.group);
    const colgrouplabels = distinct(justGroups);
    // const colgroupcount = colgrouplabels.length;
    const bgs: Record<number, string> = useMemo(
        () => ({
            0: 'bg-red-light',
            1: 'bg-orange-light',
            2: 'bg-green-light',
            3: 'bg-blue-light',
            4: 'bg-purple-light'
        }),
        []
    );
    const cn = useCallback((x: string) => bgs[colgrouplabels.indexOf(x)], [bgs, colgrouplabels]);
    const spn = useCallback((x: string) => justGroups.filter((a) => x === a).length, [justGroups]);
    const ToColGroup = React.memo(
        () =>
            isColGroups ? (
                <colgroup className='bg-blue-dark divide'>
                    <col className='text-white bg-slate-dark' span={1} />
                    {heads.map((x, ix) =>
                        x.group == null ? (
                            <col />
                        ) : heads.findIndex((a) => a.group === x.group) === ix ? (
                            <col className={cn(x.group)} span={spn(x.group)} />
                        ) : null
                    )}
                    <col className='text-white bg-zinc-dark' span={2} />
                </colgroup>
            ) : (
                <colgroup className='bg-blue-dark'>
                    <col className='text-white bg-slate-dark' span={1} />
                    <col span={heads.length} />
                    <col className='text-white bg-slate-dark' span={2} />
                </colgroup>
            ),
        (a, b) => true
    );
    const ToHeader = React.memo(
        () => (
            <thead>
                <tr>
                    <th className='py-0.5 px-2 text-center'>
                        <span className='block' title='Select this row'>
                            <FontAwesomeIcon icon={faSquare} className='text-white border border-white' size='1x' />
                        </span>
                    </th>

                    {heads
                        .map((x) => x.header)
                        .map((x) => (
                            <th key={x} scope='col' className='text-lg font-bold border border-white font-fira-sans'>
                                {toTitleCase(x)}
                            </th>
                        ))}
                    <th>
                        <span title='Edit the record in this row.'>
                            <FontAwesomeIcon icon={faPenAlt} className='block text-white border border-white' size='lg' />
                        </span>
                    </th>
                    <th>
                        <span className='block' title='Delete the record in this row.'>
                            <FontAwesomeIcon icon={faTrashCan} className='border border-white blocktext-white' size='lg' />
                        </span>
                    </th>
                </tr>
            </thead>
        ),
        (a, b) => true
    );
    const cols = dal.columns.map((x) =>
        embeddedFieldsOnType(collection).includes(x)
            ? {
                  ...getFieldFromType(collection, x),
                  fields: DAL[getFieldFromType(collection, x).type].columns.map((a) => ({
                      ...getFieldFromType(getFieldFromType(collection, x).type, a),
                      name: [x, a].join('.')
                  }))
              }
            : getFieldFromType(collection, x)
    );
    const merged = useMemo(() => cols.map((x) => ({ ...x, ...dal.fields.find((a) => a.name === x.name) })), [cols, dal.fields]);

    const cntrls = useCallback(
        (baseList: typeof merged) =>
            baseList.map((x) => {
                const {
                    icon,
                    fields,
                    reference,
                    local,
                    primitive,
                    linkingObjects,
                    embedded,
                    collection,
                    mappedTo,
                    optional,
                    objectType,
                    label,
                    el,
                    ...remain
                } = x;
                const result = {
                    ...x,
                    'data-field-kind': reference
                        ? 'reference'
                        : local
                        ? 'local'
                        : linkingObjects
                        ? 'linkingObjects'
                        : embedded
                        ? 'embedded'
                        : collection
                        ? 'collection'
                        : 'primitive',
                    required: !optional,
                    'data-object-type': objectType
                };
                return (
                    <Control
                        tag={(el as FormEl).displayName?.toUpperCase() ?? ''}
                        key={result.name}
                        El={el as FormEl}
                        {...result}
                        label={label ?? toTitleCase(result.name)}
                    />
                );
            }),
        []
    );
    const ToRow = useCallback(
        (props: {
            data?: any;
            selectClick: (ev: React.MouseEvent<HTMLElement>) => void;
            deleteClick: (ev: React.MouseEvent<HTMLElement>) => void;
            deleteEnabled: (oid: string) => boolean;
            isSelected: (oid: string) => boolean;
            onClick: (ev: React.MouseEvent<HTMLElement>) => void;
        }) => {
            const { data, selectClick, deleteClick, isSelected, deleteEnabled, onClick } = props;
            const oid = data._id.toHexString();
            const spread = $cn(
                { 'data-oid': data?._id?.toHexString() },
                {
                    selected: isSelected(oid),
                    'even:bg-yellow-minimal even:text-black': true && !isSelected(oid),
                    'odd:bg-zinc-very-dark odd:text-white': true && !isSelected(oid)
                }
            );
            return (
                <tr key={data?._id?.toHexString()} {...spread} onMouseDown={onClick} role='button'>
                    <td>
                        <SelectButtonCell oid={oid} isSelected={isSelected} onClick={selectClick} title='Select/deselect the current row.' />
                    </td>
                    {(
                        merged
                            .map((x) => (Object.getOwnPropertyNames(x).includes('fields') ? x.fields! : [x]))
                            .reduce((pv, cv) => [...pv, ...cv], []) as typeof merged
                    ).map((x) => (
                        <td
                            className='text-base font-normal text-center font-fira-sans'
                            key={x.name}
                            title={
                                x.icon
                                    ? x.reference
                                        ? (getProperty(x.name)(data) ?? {})[x.optionMap?.label ?? '_id']
                                        : (x.fromDB ?? identity)(getProperty(x.name)(data))
                                    : undefined
                            }>
                            {x.icon ? (
                                <FontAwesomeIcon size='lg' icon={x.icon} />
                            ) : x.reference ? (
                                (getProperty(x.name)(data) ?? {})[x.optionMap?.label ?? '_id']
                            ) : (
                                (x.fromDB ?? identity)(getProperty(x.name)(data))
                            )}
                        </td>
                    ))}
                    <td>
                        <button className='block bg-black text-white p-0.5 border border-white text-center' onClick={ignore}>
                            <FontAwesomeIcon icon={faPenAlt} size='lg' />
                        </button>
                    </td>
                    <td>
                        <button className='block bg-black text-white p-0.5 border border-white text-center' onClick={deleteClick} disabled={deleteEnabled(oid)}>
                            <FontAwesomeIcon icon={faTrashCan} size='lg' />
                        </button>
                    </td>
                </tr>
            );
        },
        [merged]
    );

    const editControls = React.memo(
        () => <>{cntrls(merged)}</>,
        (a, b) => true
    );
    const insertControls = React.memo(
        () => <>{cntrls(merged.filter((x) => !x.hideOnInsert))}</>,
        (a, b) => true
    );
    return {
        ToHeader,
        ToColGroup,
        editControls,
        insertControls,
        cols,
        ToRow,
        getFieldFromType,
        sorted: dal.sorted
    };
}
