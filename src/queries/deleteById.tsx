export function deleteById(params: { realm: Realm; collection: string; id: string[] }) {
    const { realm, collection, id } = params;
    try {
        realm.write(() => {
            realm.delete(id.map((x) => realm.objectForPrimaryKey(collection, new Realm.BSON.ObjectId(x))));
        });
        return Promise.resolve(id);
    } catch (error) {
        return Promise.reject(error);
    }
}

export function deleteSelected(realm: Realm, collection: string) {
    return (selected: string[]) => {
        try {
            realm.write(() => {
                realm.delete(selected.map((x) => realm.objectForPrimaryKey(collection, new Realm.BSON.ObjectId(x))));
            });
            return Promise.resolve(selected);
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
