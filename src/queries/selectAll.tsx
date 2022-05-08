import { SortDescriptor } from 'realm';

/**
 * @deprecated
 */
export function selectAll(params: { realm: Realm; collection: string; sort: SortDescriptor[] }) {
    return () => {
        try {
            const { realm, collection, sort } = params;
            return Promise.resolve(realm.objects(collection).sorted(sort));
        } catch (error) {
            Promise.reject(error);
        }
    };
}
