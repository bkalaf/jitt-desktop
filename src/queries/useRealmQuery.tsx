import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { SortDescriptor } from 'realm';
import { isNotNil } from '../common/isNotNull';
import { useLog } from '../components/providers/buildLibrary';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { useToast } from '../hooks/useToast';
import { QueryStatus } from './index';
import { useGetDefaultSort } from './useGetDefaultSort';

export function useRealmQuery<T extends { _id: Realm.BSON.ObjectId }, U = T>(
    key: string,
    $collection?: string,
    $sorted: SortDescriptor[] = [],
    predicate: () => boolean = () => true,
    select?: (d: Realm.Results<T & Realm.Object> | (T & Realm.Object) | undefined) => U
): [status: QueryStatus, refetch: () => void, data: U | undefined] {
    const realm = useLocalRealm();
    const [routedCollection, routedId] = useRoutedCollection();
    const log = useLog();
    const collection = $collection ?? routedCollection;
    const defaultSort = useGetDefaultSort(collection);
    const sorted = $sorted.length > 0 ? $sorted : defaultSort;
    const errorToast = useToast('error');
    const { data, refetch, status } = useQuery(
        [key, collection],
        () => {
            try {
                const result =
                    isNotNil(routedId) && routedId !== 'new'
                        ? realm.objectForPrimaryKey<T>(collection, new Realm.BSON.ObjectId(routedId))
                        : realm.objects<T>(collection).sorted(sorted);
                return Promise.resolve(result);
            } catch (error) {
                log(error);
                log((error as any).message);
                return Promise.reject(error);
            }
        },
        {
            suspense: true,
            enabled: predicate(),
            onError: (err: any) => {
                log(err);
                errorToast(err.message, 'ERROR!', err.name);
            },
            staleTime: 300000,
            select: (x: Realm.Results<T & Realm.Object> | (T & Realm.Object) | undefined) => (select ? select(x) : (x as any as U))
        }
    );
    const update = useCallback(() => {
        refetch({ queryKey: [key, collection] });
    }, [collection, key, refetch]);
    return [status, update, data];
}
