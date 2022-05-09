import { app } from 'electron';
import { stringify } from 'querystring';
import { distinct } from '../../common/array/distinct';
import { fst } from '../../common/tuple/fst';
import { objectFilter } from '../../common/obj/objectFilter';
import { $realm } from '../globals';
import { ITypeInfo } from '../../types/metadata/ITypeInfo';
import { IColumnInfo } from '../../types/metadata/IColumnInfo';
import { createContext, useMemo } from 'react';
import { buildLibrary } from './buildLibrary';
import { useReactiveVar } from '@apollo/client';
import { useWhyDidYou } from '../../hooks/useWhyDidYou';
export interface IMetaDataContext<T extends { _id: Realm.BSON.ObjectId } = { _id: Realm.BSON.ObjectId }> {
    library: Record<string, ITypeInfo>;
    getType(x: string): ITypeInfo;
    getColGroup(typeName: string): JSX.Element;
    getHeaders(typeName: string): JSX.Element;
    getInputControls(typeName: string): JSX.Element[];
    getEditControls(typeName: string): JSX.Element[];
    getRowComponent(typeName: string): (props: { rowData: T }) => JSX.Element;
    getInfoFor(typeName: string, name: string): IColumnInfo;
    getFormPayload(typeName: string): RealmClass<any>;
}

export const MetaDataContext = createContext<undefined | IMetaDataContext>(undefined);

export function MetaDataContextProvider(props: { children: Children }) {
    useWhyDidYou('MetaDataProvider', props);
    const realm = useReactiveVar($realm);
    const library = useMemo(() => Object.fromEntries(realm == null ? [] : buildLibrary(realm).map((x) => [x.typeName, x])), [realm]);
    const value = useMemo(
        () => ({
            library,
            getType(x: string) {
                return library[x];
            },
            getInfoFor(typeName: string, colName: string) {
                return library[typeName].columnInfos[colName];
            },
            getColGroup(typeName: string) {
                return this.getType(typeName).ColGroup;
            },
            getHeaders(typeName: string) {
                return this.getType(typeName).Headers;
            },
            getRowComponent(typeName: string) {
                return this.getType(typeName).Row;
            },
            getInputControls(typeName: string) {
                return this.getType(typeName).InputFormBody;
            },
            getEditControls(typeName: string) {
                return this.getType(typeName).EditFormBody;
            },
            getFormPayload(typeName: string) {
                return this.getType(typeName).Payload;
            }
        }),
        [library]
    );
    return <MetaDataContext.Provider value={value}>{props.children}</MetaDataContext.Provider>;
}
