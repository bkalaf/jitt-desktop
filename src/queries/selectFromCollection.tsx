import { SortDescriptor } from 'realm';

export function selectFromCollection<T extends { _id: Realm.BSON.ObjectId }>(realm: Realm) {
    return function (collection: string, sort: SortDescriptor[]): () => Promise<Realm.Results<T & Realm.Object>> {
        return () => {
            try {
                return Promise.resolve(sort ? realm.objects<T>(collection).sorted(sort) : realm.objects<T>(collection));
            } catch (error) {
                return Promise.reject(error);
            }
        };
    };
}
