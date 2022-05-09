import { process as electronProcess } from '@electron/remote';
import { cloneElement } from 'react';
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
            InputFormBody: (() => (
                <>
                    {flatColumns[name]
                        .filter((x) => x !== '_id')
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
            ))().props.children as JSX.Element[],
            // All columns
            EditFormBody: (() => (
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
            ))().props.children as JSX.Element[],
            Row: <T extends { _id: Realm.BSON.ObjectId }>(props: { rowData: T }) => {
                return (
                    <tr>
                        {flatColumns[name].map((x) => {
                            const value = (props.rowData as Record<string, any>)[x];
                            const {
                                type,
                                flags: { primitive, reference, embedded, local },
                                optionMap,
                                enumMap,
                                to
                            } = retrieveColumnInfo(name)(x);
                            let func;
                            if (primitive) {
                                func = toOutput[type] ?? identity;
                            } else if (enumMap != null) {
                                func = (y: string) => enumMap[y];
                            } else if (reference) {
                                func = (y: string) =>
                                    realm?.objectForPrimaryKey(to ?? '', new Realm.BSON.ObjectId(y))
                                        ? (realm?.objectForPrimaryKey(to ?? '', new Realm.BSON.ObjectId(y)) as Record<string, any>)[optionMap?.label ?? '']
                                        : undefined;
                            } else if (local) {
                                func = ignore;
                            }
                            return <td key={x}>{(func ?? identity)(value)}</td>;
                        })}
                    </tr>
                );
            },
            // Labels + select, delete, edit
            Headers: (() => (
                <thead>
                    <tr>
                        <th>SELECT</th>
                        <th>EDIT</th>
                        <th>DELETE</th>
                        {flatColumns[name].map(getLabelForCol(name)).map((x, ix) => (
                            <th key={ix} scope='col'>
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
