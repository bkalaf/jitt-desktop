import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router';
import { SortDescriptor } from 'realm';
import { useLocalRealm } from '../grid';
import { ViewKind } from './ViewKind';

export interface IGridViewContext<T extends { _id: Realm.BSON.ObjectId } = { _id: Realm.BSON.ObjectId }> {
    viewKind: 'grid';
    collection: string;
    sorted: SortDescriptor[];
    filtered: string;
    selected: string[];
    data?: Realm.Results<T>;
}
export interface IInsertViewContext<T extends { _id: Realm.BSON.ObjectId } = { _id: Realm.BSON.ObjectId }> {
    viewKind: 'insert';
    collection: string;
    data?: T;
}
export interface IEditViewContext<T extends { _id: Realm.BSON.ObjectId } = { _id: Realm.BSON.ObjectId }> {
    viewKind: 'edit';
    collection: string;
    id: string;
    data?: Result<T>;
}

export type IViewContext<T extends { _id: Realm.BSON.ObjectId } = { _id: Realm.BSON.ObjectId }> =
    | IGridViewContext<T>
    | IInsertViewContext<T>
    | IEditViewContext<T>;
// export interface IViewContext {
//     viewKind: ViewKind | 'none';
//     collection?: string;
//     id?: Realm.BSON.ObjectId;
//     sorted?: SortDescriptor[];
//     filtered?: string;
//     selected?: string[];
//     // editting?: [false] | [true, Realm.BSON.ObjectId];
//     // page?: [current: number, of: number];
//     // searchState?: any[];
// }

export const ViewContext = createContext<IViewContext | undefined>(undefined);

// console.log(/\//.test('/'));
// console.log(COLLECTION_REGEX.test('/data/v1/facility'))
// console.log(/\/\w*\/v1\/?(\w*)\/?(\w*)/.exec('/data/v1'))
// console.log(/\/\w*\/v1\/?(\w*)\/?(\w*)/.exec('/data/v1/facility'))
// console.log(/\/\w*\/v1\/?(\w*)\/?(\w*)/.exec('/data/v1/facility/new'))
// console.log(/\/\w*\/v1\/?(\w*)\/?(\w*)/.exec('/data/v1/facility/1234556'))
// console.log(/\/\w*\/v1\/?(\w*)\/?(\w*)/.exec('/data/v1/facility/1234556'))

// console.log(COLLECTION_REGEX.exec('/data/v1')?.slice(1, 3))
// console.log(COLLECTION_REGEX.exec('/data/v1/self-storage')?.slice(1, 3))
// console.log(COLLECTION_REGEX.exec('/data/v1/facility')?.slice(1, 3))
// console.log(COLLECTION_REGEX.exec('/data/v1/rental-unit/new')?.slice(1, 3))
// console.log(COLLECTION_REGEX.exec('/data/v1/brand/12345678139439109234191')?.slice(1, 3));

const COLLECTION_REGEX = /\/\w*\/v1\/?([\w-]*)\/?([\w-]*)/;

export function ViewProvider<T extends { _id: Realm.BSON.ObjectId } = { _id: Realm.BSON.ObjectId }>({
    children,
    viewKind,
    ObjClass
}: {
    children: Children;
    viewKind: ViewKind;
    ObjClass: RealmClass<T>;
}) {
    const location = useLocation();
    const realm = useLocalRealm();

    const [collection, id, insert] = useMemo(() => {
        const [a, b] = COLLECTION_REGEX.exec(location.pathname)?.slice(1, 3) ?? [];
        return [a.length === 0 ? undefined : a, b.length === 0 ? undefined : b === 'new' ? undefined : b, b === 'new'];
    }, [location.pathname]);
    const vk =
        id != null && viewKind !== 'edit'
            ? 'edit'
            : id == null && collection != null && !insert && viewKind !== 'grid'
            ? 'grid'
            : insert && viewKind !== 'insert'
            ? 'insert'
            : 'none';

    const { data: data1 } = useQuery(['selectAll', collection], () => Promise.resolve(realm.objects<T>(collection ?? 'n/a')), {
        enabled: viewKind === 'grid',
        suspense: true,
        staleTime: 12000
    });
    const { data: data2 } = useQuery(
        ['selectAll', collection],
        () => Promise.resolve(realm.objectForPrimaryKey<T>(collection ?? 'n/a', new Realm.BSON.ObjectId(id))),
        { enabled: viewKind === 'edit', suspense: true, staleTime: 12000 }
    );

    const context = useMemo(() => {
        const value: Partial<IViewContext> = { viewKind, collection };
        switch (viewKind) {
            case 'grid':
                (value as IGridViewContext).sorted = [];
                (value as IGridViewContext).filtered = '';
                (value as IGridViewContext).selected = [];
                (value as IGridViewContext).data = data1;
                break;
            case 'insert':
                (value as IInsertViewContext).data = new ObjClass();
                break;
            case 'edit':
                (value as IEditViewContext).id = id!;
                (value as IEditViewContext<T>).data = data2 as Result<T> | undefined;
                break;
        }
        return value as IViewContext;
    }, [ObjClass, collection, data1, data2, id, viewKind]);

    if (viewKind != vk) throw new Error(`viewkind mistmatch: passed: ${viewKind} calculated: ${vk}`);

    return <ViewContext.Provider value={context}>{children}</ViewContext.Provider>;
}
// export function useProvideViewContext(): IViewContext {
//     const [viewKind, setViewKind] = useState<ViewKind | 'none'>('none');
//     const setGrid = () => setViewKind('grid');
//     const setInsert = () => setViewKind('insert');
//     const setEdit = () => setViewKind('edit');

//     const location = useLocation();
//     const [collection, $id, insert] = useMemo(() => {
//         const [a, b] = COLLECTION_REGEX.exec(location.pathname)?.slice(1, 3) ?? [];
//         return [a.length === 0 ? undefined : a, b.length === 0 ? undefined : b === 'new' ? undefined : b, b === 'new'];
//     }, [location.pathname]);
//     const id = useMemo(() => ($id == null ? undefined : new Realm.BSON.ObjectId($id)), [$id]);

//     const [selected, setSelected] = useState<string[]>([]);

//     const [sorted, setSorted] = useState<SortDescriptor[]>([]);
//     const [filtered, setFiltered] = useState<string>('');

// }
