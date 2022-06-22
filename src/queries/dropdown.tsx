export function dropdown(realm: Realm, collection: string, [key, value]: [string, string]) {
    return () => {
        try {
            const result: Record<string, string> = {};
            const data = realm.objects(collection);
            console.log('dropdowndata', data);
            data.map((x: any) => [x[key]?.toHexString(), x[value]])
            data.forEach((d: any) => {
                console.log(`dkey`, d[key], `dvalue`, d[value]);
                result[d[key]] = d[value];
            });
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    };
}
