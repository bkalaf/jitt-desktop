import { process as electronProcess } from '@electron/remote';
import { cloneElement, useCallback, useEffect, useRef, useState, useTransition } from 'react';
import { createFrom } from '../../common/array/createFrom';
import { identity } from '../../common/identity';
import { ignore } from '../../common/ignore';
import { toTitleCase } from '../../common/text/toTitleCase';
import { schema as ocSchema } from '../../data';
import { Control } from '../forms/Control';
import { Output } from '../forms/elements/Output';
import { DAL } from './DAL';
import { toOutput } from './DataTypeInfo';
import { echo } from '../../common/echo';
import { ITypeInfo } from '../../types/metadata/ITypeInfo';
import { ofProperties } from './ofProperties';
import { embeddedFieldsByType } from './embeddedFieldsByType';
import { getProperty } from '../../common';
import { IconButton } from '../MainWindow';
import { faPenAlt, faTrashCan, faSquare, faCheckSquare, IconDefinition, faWindowClose } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DuotoneIcon } from '../icons/DuotoneIcon';
// import { faSquare } from '@fortawesome/pro-regular-svg-icons';
import { TableRow } from '../Table/Row';
import { TableCell } from '../Table/Cell';
import { Btn } from './Btn';
import { toString } from '../../common/toString';
import { useViewContext } from '../../hooks/useViewContext';
import { IGridViewContext } from './ViewProvider';
import { attemptToGetOID } from '../../util';
import { deleteSelected } from '../../queries/deleteById';
import { DuotoneBtn, DuotoneButton } from './DuotoneBtn';
import { useMetaDataContext } from '../Toaster';
import { IColumnInfo } from '../../types';
import { useToggle } from '../../hooks/useToggle';
import { ModalContainer } from '../ModalContainer';
import { FilePreview } from '../MainRouter';
import { MimeTypes } from '../../data/enums/mimeTypes';

export function DataCell({ result, icon, x, mimeType }: { result: ArrayBuffer; icon: IconDefinition; x: string; mimeType: MimeTypes }) {
    const [showImage, toggleImage] = useToggle(false);
    const [src, setSrc] = useState<undefined | string>(undefined);
    const reader = useRef(new FileReader());
    const cb = useCallback((ev: ProgressEvent<FileReader>) => setSrc(ev.target!.result as string), [])
    useEffect(() => {
        const r = reader.current;
        r.addEventListener('loadend', cb);
        return () => r.removeEventListener('loadend', cb);
    }, [cb]);
    useEffect(() => {
        if (src == null && reader.current.readyState === reader.current.EMPTY) {
            reader.current.readAsDataURL(new Blob([result], { type: 'application/pdf' }));
        }
        return () => src != null ? URL.revokeObjectURL(src) : ignore();
    }, [result, src]);
    return (
        <TableCell key={x}>
            <DuotoneButton icon={icon} primary='red' secondary='black' size='lg' onClick={toggleImage} />
            {showImage && (
                <ModalContainer>
                    <div className='relative flex items-center justify-center w-full h-full p-4 '>
                        <DuotoneButton
                            primary='white'
                            secondary='cyan'
                            icon={faWindowClose}
                            size='2x'
                            className='absolute top-0 right-0 mt-2 mr-2'
                            onClick={toggleImage}></DuotoneButton>
                        {mimeType === 'pdf' ? <iframe src={`${src}#zoom-75`} className='flex object-scale-down w-full h-full' /> : <img src={src} className='flex object-scale-down w-full h-full' />}
                    </div>
                </ModalContainer>
            )}
        </TableCell>
    );
}
export function useLog() {
    const log = useCallback((name: any, ...args: string[]) => {
        electronProcess.stdout.write([typeof name !== 'string' ? JSON.stringify(name) : name, ...args].join(' :: ').concat('\n'));
        console.log(name, ...args);
    }, []);
    return log;
}
const testOnClick = () => alert('clicked');
export function buildLibrary(realm: Realm) {
    console.group('buildLibrary');
    const { schema } = realm;
    const embeddedTypes = schema
        .map((x) => ({ name: x.name, embedded: x.embedded }))
        .filter((x) => x.embedded)
        .map((x) => x.name);
    const embeddedForType = (x: string) => embeddedFieldsByType(schema)[x];
    const isEmbeddedForType = (typeName: string) => (colName: string) => Object.getOwnPropertyNames(embeddedForType(typeName)).includes(colName);

    const getColumnType = (typeName: string) => (colName: string) => embeddedForType(typeName)[colName].objectType ?? '';

    const unflattenedColumns = Object.fromEntries(Object.entries(DAL).map(([typeName, entry]) => [typeName, entry.columns] as [string, string[]]));

    const retrieveColumnInfo = (typeName: string) => (colName: string) =>
        ofProperties(embeddedTypes, typeName, schema.find((a) => a.name === typeName)?.properties ?? {})[colName];
    const getLabelForCol = (typeName: string) => (colName: string) =>
        ofProperties(embeddedTypes, typeName, schema.find((a) => a.name === typeName)?.properties ?? {})[colName]?.label ?? toTitleCase(colName);
    const flatColumns = Object.fromEntries(
        Object.entries(unflattenedColumns).map(([tn, cols]) => [
            tn,
            cols
                .map((col) =>
                    !isEmbeddedForType(tn)(col)
                        ? ([[col, undefined]] as [string, string | undefined][])
                        : unflattenedColumns[getColumnType(tn)(col)].map((p) => [p, col] as [string, string | undefined])
                )
                .reduce((pv, cv) => [...pv, ...cv], [])
                .map(([x, y]) => (y == null ? x : [y, x].join('.')))
        ])
    );
    // const controlList = Object.entries(unflattenedColumns).map(([tn, cols]) => [tn, cols.map((c) => {
    //     if (!isEmbeddedForType(tn)(c)) {
    //         return [[c, retrieveColumnInfo(tn)(c)] as [string, IColumnInfo]];
    //     }
    //     const etn = getColumnType(tn)(c);
    //     return unflattenedColumns[etn].map(p => ([[c, p].join('.'), {
    //         ...retrieveColumnInfo(etn)(p),
    //         name: [c, p].join('.')
    //     }]))
    // }).reduce((pv, cv) => [...pv, ...cv], [])])
    const typeNames = schema.map((x) => {
        const [key, value] = [x.name, { ...x }];
        const { primaryKey, embedded, name, properties, ...remain } = value;
        const spread: ITypeInfo = {
            ...remain,
            typeName: name,
            embedded: embedded ?? false,
            flatColumns: flatColumns[name],
            columnInfos: Object.fromEntries(
                Object.entries(ofProperties(embeddedTypes, x.name, properties)).map(([name, props]) => [
                    name,
                    { ...props, label: props.label ?? toTitleCase(props.name) }
                ])
            ),
            // Filter out _id field
            InputFormBody: () => {
                const { getInfoFor, getControlList } = useMetaDataContext();
                return (
                    <>
                        {getControlList(name)
                            .filter((x) => x.name !== '_id' && x.datatype !== 'linkingObjects')
                            .map((info) => {
                                console.log('handling...', info);
                                // electronProcess.stdout.write(`isDotNotation: ${isDotNotation} name: ${name} x: ${x} t: ${t} f: ${f}\n`);
                                // electronProcess.stdout.write(`DAL[t]: ${DAL[t]}\n`);
                                // electronProcess.stdout.write(`DAL[t].fields: ${DAL[t].fields}\n`);
                                // electronProcess.stdout.write(`DAL[t].fields.find: ${DAL[t].fields.find((a) => a.name === f)}\n`);

                                if (info == null) return <Control name={x.name} key={x.name} El={Output} tag='OUTPUT' label={toTitleCase(x.name)} />;
                                if (info.el == null) throw new Error('element null');
                                const tag = (info.el as React.FunctionComponent).displayName?.toUpperCase() ?? '';
                                const { mappedTo, objectType, property, typeName, flags, ...spread } = info;
                                return (
                                    <Control
                                        key={info.name}
                                        El={info.el}
                                        tag={tag}
                                        label={getLabelForCol(x.name)(info.name)}
                                        objectType={objectType}
                                        {...spread}
                                    />
                                );
                            })}
                    </>
                );
            },
            // All columns
            EditFormBody: () => (
                <>
                    {flatColumns[name]
                        .filter((x) => x !== '_id')
                        .map(echo)
                        .map((x) => {
                            const isDotNotation = /\w*[.]\w*/.test(x);
                            const t = isDotNotation ? getColumnType(name)(x.split('.')[0]) : name;
                            const f = isDotNotation ? x.split('.')[1] : x;
                            // electronProcess.stdout.write(`isDotNotation: ${isDotNotation} name: ${name} x: ${x} t: ${t} f: ${f}\n`);
                            // electronProcess.stdout.write(`DAL[t]: ${DAL[t]}\n`);
                            // electronProcess.stdout.write(`DAL[t].fields: ${DAL[t].fields}\n`);
                            // electronProcess.stdout.write(`DAL[t].fields.find: ${DAL[t].fields.find((a) => a.name === f)}\n`);
                            const info = isDotNotation ? DAL[t].fields.find((a) => a.name === f)! : DAL[t].fields.find((a) => a.name === f)!;
                            if (info == null) return <Control name={x} key={x} El={Output} tag='OUTPUT' label={toTitleCase(x)} />;
                            const tag = info.el({}).type.toUpperCase();
                            return <Control key={x} El={info.el} tag={tag} label={getLabelForCol(name)(x)} {...info} />;
                        })}
                </>
            ),
            Row: <T extends { _id: Realm.BSON.ObjectId }>(props: { rowData: T }) => {
                console.log(props.rowData);
                const { isSelected, onClick, deleteRows } = useViewContext() as IGridViewContext;
                const { getInfoFor } = useMetaDataContext();
                // const [isLoading, startTransition] = useTransition();
                try {
                    return (
                        <TableRow oid={props.rowData._id.toHexString()}>
                            <TableCell className='min-w-[5rem] w-[5rem]'>
                                <DuotoneBtn
                                    onClick={onClick}
                                    primary='darkblue'
                                    secondary={isSelected(props.rowData._id.toHexString()) ? 'forestgreen' : 'red'}
                                    icon={isSelected(props.rowData._id.toHexString()) ? faCheckSquare : faSquare}
                                    bg='bg-slate-very-dark'
                                    size='lg'
                                    secondaryOpacity={0.7}
                                    title='Select this row.'
                                    initState={false}
                                />
                            </TableCell>
                            <TableCell className='min-w-[5rem] w-[5rem]'>
                                <DuotoneBtn
                                    onClick={testOnClick}
                                    title='Edit this row.'
                                    initState={false}
                                    icon={faPenAlt}
                                    primary='red'
                                    secondary='coral'
                                    bg='bg-slate-very-dark'
                                    size='lg'
                                />
                            </TableCell>
                            <TableCell className='min-w-[5rem] w-[5rem]'>
                                <DuotoneBtn
                                    onClick={() => {
                                        deleteRows([props.rowData._id.toHexString()]);
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
                            </TableCell>

                            {flatColumns[name].map((x) => {
                                console.log(`HANDLING: ${x}`);
                                const value = getProperty(x)(props.rowData);
                                const {
                                    datatype,
                                    flags: { primitive, reference, embedded, local },
                                    optionMap,
                                    enumMap,
                                    to,
                                    icon,
                                    asDisplay,
                                    iconTrue,
                                    iconFalse
                                } = getInfoFor(name, x);
                                let func;
                                console.log(
                                    `type, primitive, enumMap, reference, local, toOutput`,
                                    x,
                                    value,
                                    datatype,
                                    primitive,
                                    enumMap,
                                    reference,
                                    local,
                                    toOutput
                                );
                                if (icon) {
                                    const result = value;
                                    if (datatype === 'data') {
                                        console.log('handling-data');
                                        return <DataCell mimeType={(props.rowData as any).mimeType} result={result} x={x} icon={icon} />;
                                    }

                                    func = function (x: any) {
                                        const id = toOutput[datatype](x) as string;
                                        return (
                                            <TableCell key={x} title={id}>
                                                <FontAwesomeIcon size='lg' icon={icon} className='block' />
                                            </TableCell>
                                        );
                                    };
                                } else if (iconTrue) {
                                    return (
                                        <TableCell key={x}>
                                            <DuotoneIcon
                                                icon={value === 'true' ? iconTrue : iconFalse!}
                                                size='lg'
                                                primaryOpacity={1.0}
                                                secondaryOpacity={0.9}
                                                primary='linen'
                                                secondary={value === 'true' ? 'red' : 'black'}
                                            />
                                        </TableCell>
                                    );
                                } else if (asDisplay) {
                                    func = (x: any) => x.displayAs;
                                } else if (datatype === 'object') {
                                    console.log('optionMap', optionMap);
                                    func = function (a?: Record<string, any>) {
                                        return a != null ? a[optionMap?.label ?? ''] : '/';
                                    };
                                } else if (primitive) {
                                    func = toOutput[datatype] ?? identity;
                                } else if (enumMap != null) {
                                    func = (y: string) => enumMap[y];
                                } else if (reference) {
                                    func = (y: string) =>
                                        realm?.objectForPrimaryKey(to ?? '', new Realm.BSON.ObjectId(y))
                                            ? (realm?.objectForPrimaryKey(to ?? '', new Realm.BSON.ObjectId(y)) as Record<string, any>)[optionMap?.label ?? '']
                                            : undefined;
                                } else if (local) {
                                    func = identity;
                                }
                                return (
                                    <TableCell key={x}>
                                        <span>{(func ?? toString)(value)}</span>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                } catch (error) {
                    console.log(error);
                    console.log((error as any).message);
                    console.log('FAILED ON', props.rowData);
                    return <></>;
                }
            },
            // Labels + select, delete, edit
            Headers: (() => (
                <thead>
                    <tr>
                        <th className='text-lg font-bold leading-loose tracking-wider text-center text-white border border-white divide-white divide font-fira-sans'>
                            SELECT
                        </th>
                        <th className='text-lg font-bold leading-loose tracking-wider text-center text-white border border-white divide-white divide font-fira-sans'>
                            EDIT
                        </th>
                        <th className='text-lg font-bold leading-loose tracking-wider text-center text-white border border-white divide-white divide font-fira-sans'>
                            DELETE
                        </th>
                        {flatColumns[name].map(getLabelForCol(name)).map((x, ix) => (
                            <th
                                className='text-lg font-bold leading-loose tracking-wider text-center text-white border border-white divide-white bg-blue-dark divide font-fira-sans'
                                key={ix}
                                scope='col'>
                                {x}
                            </th>
                        ))}
                    </tr>
                </thead>
            ))(),
            ColGroup: (() => {
                return (
                    <colgroup>
                        <col className='text-white bg-slate-very-dark' span={3} />
                        {createFrom(() => <col />, flatColumns[name].length).map((x, ix) => cloneElement(x as JSX.Element, { ...x.props, key: ix }))}
                    </colgroup>
                );
            })(),
            Payload: ocSchema.find((x) => x.schema.name === name)!
        };

        return spread;
    });
    // , retrieveColumnInfo, getColumnType];
    // electronProcess.stderr.write((error as Error).name);
    // electronProcess.stderr.write((error as Error).message);
    // console.log(flatColumns);
    // console.log(typeNames.find(x => x.typeName === 'self-storage')?.Row({ rowData: { _id: new Realm.BSON.ObjectId(), name: 'Public Sotrage', website: 'https:///www.ps.com' } as { _id: Realm.BSON.ObjectId, name: string, website?: string }}));
    // electronProcess.stdout.clearScreenDown();
    // electronProcess.stdout.write(JSON.stringify(typeNames));
    // try {
    //     electronProcess.stdout.write(
    //         JSON.stringify(
    //             typeNames.map((y) => y.InputFormBody),
    //             null,
    //             '\t'
    //         )
    //     );
    // } catch (error) {
    //     electronProcess.stderr.write((error as Error).name);
    //     electronProcess.stderr.write((error as Error).message);
    // }
    console.groupEnd();
    return typeNames;
}

export function checkSelectedToDisable(isSelected: (o: string) => boolean) {
    return (ref: React.RefObject<HTMLButtonElement>) => {
        return ref.current ? !isSelected(attemptToGetOID(ref.current!) ?? '') : true;
    };
}
