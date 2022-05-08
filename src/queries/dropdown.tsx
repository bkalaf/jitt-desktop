export function dropdown(realm: Realm, collection: string, [key, value]: [string, string]) {
    return () => {
        try {
            const result: Record<string, string> = {};
            realm.objects(collection).forEach((d: any) => {
                result[d[key]] = d[value];
            });
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
