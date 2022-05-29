import { ITypeInfo } from '../../types/metadata/ITypeInfo';
import { IColumnInfo } from '../../types/metadata/IColumnInfo';
import { createContext, useCallback, useMemo } from 'react';
import { useWhyDidYou } from '../../hooks/useWhyDidYou';
import { isDotNotation } from '../../util';
import { LazyDataOrModifiedFn } from 'use-async-resource';
import {  Auctions, Files, Length, Storages } from '../../data';
import { UninitializedContextError } from './UninitializedContextError';
import { $ } from './../../data/$';
export interface IMetaDataContext<T extends { _id: Realm.BSON.ObjectId } = { _id: Realm.BSON.ObjectId }> {
    library: Record<string, ITypeInfo>;
    getType(x: string): ITypeInfo;
    getColGroup(typeName: string): JSX.Element;
    getHeaders(typeName: string): JSX.Element;
    getInputControls(typeName: string): () => JSX.Element;
    getEditControls(typeName: string): () => JSX.Element;
    getRowComponent(typeName: string): (props: { rowData: T }) => JSX.Element;
    getInfoFor(typeName: string, name: string): IColumnInfo;
    getFormPayload(typeName: string): RealmClass<any>;
    getControlList(typeName: string): IColumnInfo[];
}

export const MetaDataContext = createContext<undefined | IMetaDataContext>(undefined);

export function MetaDataContextProvider(props: { children: Children; reader: LazyDataOrModifiedFn<Realm> }) {
    useWhyDidYou('MetaDataProvider', props);
    const realm = props.reader();
    // if (realm == null) throw new UninitializedContextError(MetaDataContext.displayName);
    // const library = useMemo(() => {
    //     return undefined
    //     // return Object.fromEntries(realm == null ? [] : buildLibrary(realm).map((x) => [x.typeName, x]));
    // }, []);
    // const getControlUnflat = useCallback(
    //     (typename: string) => {
    //         return Object.values(library[typename].columnInfos);
    //     },
    //     [library]
    // );
    // const getControlFlat = useCallback(
    //     (typename: string): IColumnInfo[] => {
    //         const infos = getControlUnflat(typename);
    //         return infos
    //             .map((x) => (x.flags.embedded ? getControlFlat(x.objectType ?? '').map((a) => ({ ...a, name: [x.name, a.name].join('.') })) : [x]))
    //             .reduce((pv, cv) => [...pv, ...cv], []);
    //     },
    //     [getControlUnflat]
    // );
    // const value = useMemo(
    //     () => ({
    //         library,
    //         getType(x: string) {
    //             return library[x];
    //         },
    //         getControlList: getControlFlat,
    //         getInfoFor(typeName: string, colName: string) {
    //             function inner(t: string, c: string): IColumnInfo {
    //                 if (isDotNotation(c)) {
    //                     console.log('t', t, 'c', c);
    //                     const [head, ...tail] = c.split('.');
    //                     const current = library[t].columnInfos[head];
    //                     console.log(`current`, current);
    //                     return inner(current.objectType ?? '', tail.join('.'));
    //                 }
    //                 return library[t].columnInfos[c];
    //             }
    //             return inner(typeName, colName);
    //         },
    //         getColGroup(typeName: string) {
    //             return library[typeName].ColGroup;
    //         },
    //         getHeaders(typeName: string) {
    //             return library[typeName].Headers;
    //         },
    //         getRowComponent(typeName: string) {
    //             return library[typeName].Row;
    //         },
    //         getInputControls(typeName: string) {
    //             console.log(`typeName`, typeName);
    //             return library[typeName].InputFormBody;
    //         },
    //         getEditControls(typeName: string) {
    //             return library[typeName].EditFormBody;
    //         },
    //         getFormPayload(typeName: string) {
    //             return {
    //                 [$.selfStorage]: () => new Storages.SelfStorage(),
    //                 [$.facility]: () => new Storages.Facility(),
    //                 [$.rentalUnit]: () => new Storages.RentalUnit(),
    //                 [$.purchase]: () => new Auctions.Purchase(),
    //                 [$.address]: () => new Storages.Address(),
    //                 [$.cost]: () => new Auctions.Cost(),
    //                 [$.fsAlloc]: () => new Files.FileAlloc(),
    //                 [$.fsItem]: () => new Files.FileItem(),
    //                 [$.length]: () => new Length(),
    //                 [$.squareFootage]: () => new Storages.SquareFootage()
    //             }[typeName] as any;
    //         }
    //     }),
    //     [getControlFlat, library]
    // );
    return <MetaDataContext.Provider value={undefined}>{props.children}</MetaDataContext.Provider>;
}
