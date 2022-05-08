export function insertMutation<T extends Record<string, any>>(realm: Realm, collectionName: string) {
    return function (fd: T): Promise<T & Realm.Object> {
        try {
            let result: (T & Realm.Object) | undefined;
            realm.write(() => {
                result = realm.create<T>(collectionName, fd, Realm.UpdateMode.Modified);
            });
            return Promise.resolve(result!);
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
