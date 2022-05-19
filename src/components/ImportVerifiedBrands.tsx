import { useCallback, useEffect } from 'react';
import { fst } from '../common';
import { files } from '../config';
import { mongo, VerifiedBrand } from '../data';
import { useLog } from './providers/buildLibrary';
import { readFile } from '../common/fs/readFile';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { filterDistinct } from './filterDistinct';
import { useMutation } from 'react-query';
import { Spinner } from './Indicators/Spinner';
import { useEmit } from './useEmit';
import { useEventAggregator } from './useEventAggregator';
import { $$eventNames } from './AdminMenu';
import { useLocalStorageKey } from './useLocalStorageKey';

export function IntegrityCheckBrands() {
    const realm = useLocalRealm();
    const verifiedBrands = realm.objects<VerifiedBrand>(mongo.verifiedBrand).map((x) => x.name);
    const log = useLog();
    const duplicatedBrands = filterDistinct(verifiedBrands);
    log(`duplicates: ${duplicatedBrands.length}`);
    return <></>;
}

export function ImportVerifiedBrands() {
    async function inner(todos: string[]): Promise<void> {
        log(`inner.length: ${todos.length}`)
        if (todos.length === 0) return await Promise.resolve();
        const [brand, ...tail] = todos;
        log(`handling: ${brand}`);
        realm.write(() => {
            const isDupe = verifiedBrands.find((x) => x.name === brand);
            if (isDupe == null) {
                log(`inserting: ${brand}`);
                realm.create(mongo.verifiedBrand, { _id: new Realm.BSON.ObjectId(), name: brand });
            } else {
                log('DUPE, skipped');
            }
        });
        return await inner(tail);
    }
    const realm = useLocalRealm();
    const scraped = JSON.parse(readFile(files.brandListings)).uniqueBrands as [string, string][];
    const scrapedUnique = scraped.map(fst);
    const log = useLog();

    const verifiedBrands = realm.objects<VerifiedBrand>(mongo.verifiedBrand);

    const notEntered = scrapedUnique.filter((brand) => !verifiedBrands.map((x) => x.name).includes(brand));
    log(`total verified brands: ${scrapedUnique.length}`);
    log(`total entered brands: ${verifiedBrands?.length ?? 0}`);
    log(`not entered: ${notEntered.length}`);

    const mutation = useMutation(async () => await inner(notEntered));

    const emitter = useEventAggregator();
    const importKey = useLocalStorageKey('admin', 'import')
    const cb = useCallback((key: string) => {
        log(key);
    }, []);

    log(`inserted: ${realm.objects(mongo.verifiedBrand).length}`);
    return <>{mutation.isLoading && <Spinner />}</>;
}

