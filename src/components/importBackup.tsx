import { readFile } from '../common/fs/readFile';
import { ObjectId } from 'bson';
import { identity } from '../common';
import { now } from '../aggregator';
import { Admin, Auctions, Files, Scrapes, Storages } from '../data';
import * as fs from 'graceful-fs';

export function enterActivity(realm: Realm, action: any, scope: any, isComplete: boolean) {
    realm.write(() => {
        realm.create('activity', {
            _id: new ObjectId(),
            action,
            scope,
            isComplete,
            isScheduled: false,
            when: now()
        });
    });
}

export function findObjectsNotInRealm(realm: Realm, collection: string, items: any[]) {
    return items.filter((item) => realm.objectForPrimaryKey(collection, new ObjectId(item._id)) == null);
}
export function logCounts(log: any, input: any[] = [], filtered: any[] = [], collection = '') {
    log(`*** ${collection} ***`);
    log(`  Entered: ${input.length}`);
    log(`  Filtered: ${filtered.length}`);
}
export async function restoreBackup({ realm, log, scope, action }: { realm: Realm; log: any; scheduledItem: any; scope: any; action: any; onDemand: boolean }) {
    async function importFileItems() {
        const objs = realm.objects<any>('fs-alloc').filter(x => x.fileCreation != null);
        log(`FOUND: ${objs.length}`);
        objs.forEach(o => {
            const p = ['/home/bobby/.config/jitt-desktop/fs', o.materializedPath].join('/');
          
            Files.FileItem.convertTo(realm, p);
        });
    }
    async function inner(collectionName: string, original: any[], todos: any[], convertFrom: any) {
        try {
            logCounts(log, original, todos);
            await Promise.all(todos.map(indiv => convertFrom(realm, indiv))).then((x: any[]) => {
                try {
                    x.forEach((item, ix: number) => {
                    realm.write(() => {
                        try {
                            realm.create(collectionName, item);
                        } catch (error) {
                            log((error as any).message);
                            log(item);
                            log(todos[ix]);
                            log(collectionName);
                        }
                    });
                });
                } catch (error) {
                    log((error as any).message);
                }
            });
            log(`${collectionName} DONE`);
        } catch (error) {
            log((error as any).message);
        }
    }
    const data = readFile(`/home/bobby/.config/jitt-desktop/backup/db.json`);
    const {
        activity,
        category,
        facility,
        'fs-alloc': fsAlloc,
        'fs-item': fsItem,
        purchase,
        'rental-unit': rentalUnit,
        'self-storage': selfStorage,
        taxonomy,
        'verified-brand': verifiedBrand
    } = JSON.parse(data);

    const todo = {
        activity: findObjectsNotInRealm(realm, 'activity', activity),
        category: findObjectsNotInRealm(realm, 'category', category),
        facility: findObjectsNotInRealm(realm, 'facility', facility),
        fsAlloc: findObjectsNotInRealm(realm, 'fs-alloc', fsAlloc),
        fsItem: findObjectsNotInRealm(realm, 'fs-item', fsItem),
        purchase: findObjectsNotInRealm(realm, 'purchase', purchase),
        rentalUnit: findObjectsNotInRealm(realm, 'rental-unit', rentalUnit),
        selfStorage: findObjectsNotInRealm(realm, 'self-storage', selfStorage),
        taxonomy: findObjectsNotInRealm(realm, 'taxonomy', taxonomy),
        verifiedBrand: findObjectsNotInRealm(realm, 'verified-brand', verifiedBrand)
    };

    await inner('activity', activity, todo.activity, Admin.Activity.convertFrom);
    await inner('verified-brand', verifiedBrand, todo.verifiedBrand, Scrapes.VerifiedBrand.convertFrom);
    await inner('category', category, todo.category, Scrapes.Category.convertFrom);
    await inner('taxonomy', taxonomy, todo.taxonomy, Scrapes.Taxonomy.convertFrom);
    await inner('self-storage', selfStorage, todo.selfStorage, Storages.SelfStorage.convertFrom);
    await inner('facility', facility, todo.facility, Storages.Facility.convertFrom);
    await inner('rental-unit', rentalUnit, todo.rentalUnit, Storages.RentalUnit.convertFrom);
    await importFileItems();
    await inner('fs-alloc', fsAlloc, todo.fsAlloc, Files.FileAlloc.convertFrom);
    await inner('purchase', purchase, todo.purchase, Auctions.Purchase.convertFrom);
}
export function importBackup({ realm, log, scope }: { realm: Realm; log: any; scheduledItem: any; scope: any; action: any; onDemand: boolean }) {
    function convertPromise(c: string, func: (x: any) => Promise<any>) {
        return (entry: any) => func(entry).then((x) => realm.create(c, x));
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    function onEach(c: string, func: (x: any) => any) {
        return async (entry: any) => realm.create(c, func(entry), Realm.UpdateMode.All);
    }
    // eslint-diimport { identity } from '../common/identity';
    // eslint-disable-next-line @typescript-eslint/ban-types
    function inner(collection: string, collectionSet: any[], convert: Function, forEachFunc: (c: string, f: any) => (x: any) => Promise<any> = onEach) {
        try {
            realm.write(() => {
                const result = collectionSet
                    .filter((rcrd: any) => realm.objectForPrimaryKey(collection, new ObjectId(rcrd._id)) == null)
                    .map(forEachFunc(collection, convert))
                    .reduce(
                        (pv, cv) => async () => {
                            await pv();
                            await cv;
                        },
                        () => Promise.resolve()
                    );
                result().then((x) => log(`collectionSet ${collection} done!`));
            });
        } catch (error) {
            console.error((error as any).name);
            console.error((error as any).message);
            console.error(collection);
            console.error(collectionSet);
            alert(`failed: ${collection}`);
        }
    }
    const data = readFile(`/home/bobby/.config/jitt-desktop/backup/db.json`);
    const {
        activity,
        category,
        facility,
        'fs-alloc': fsAlloc,
        'fs-item': fsItem,
        purchase,
        'rental-unit': rentalUnit,
        'self-storage': selfStorage,
        taxonomy,
        'verified-brand': verifiedBrand
    } = JSON.parse(data);
    inner('self-storage', selfStorage, (x: any) => ({ ...x, _id: new ObjectId(x._id) }));
    inner('facility', facility, (x: any) => ({ ...x, _id: new ObjectId(x._id), selfStorage: new ObjectId(x.selfStorage._id) }));
    inner('rental-unit', rentalUnit, (x: any) => ({ ...x, _id: new ObjectId(x._id), facility: new ObjectId(x.facility._id) }));
    inner(
        'fs-item',
        fsItem,
        async (x: any) => await new Blob([x.data]).arrayBuffer().then((buffer) => ({ ...x, _id: new ObjectId(x._id), data: buffer })),
        convertPromise
    );
    inner('fs-alloc', fsAlloc, (x: any) => ({
        ...x,
        _id: new ObjectId(x._id),
        fsItem: x.fsItem != null ? new ObjectId(x.fsItem) : undefined,
        parent: new ObjectId(x.parent)
    }));
    inner('purchase', purchase, (x: any) => ({
        ...x,
        _id: new ObjectId(x._id),
        rentalUnit: new ObjectId(x.rentalUnit._id),
        invoice: x != null ? new ObjectId(x.invoice) : undefined
    }));
    inner('activity', activity, (x: any) => ({ ...x, _id: new ObjectId(x._id) }));
    inner('verified-brand', verifiedBrand, (x: any) => ({ ...x, _id: new ObjectId(x._id) }));
    inner('category', category, (x: any) => ({ ...x, _id: new ObjectId(x._id) }));
    inner('taxonomy', taxonomy, (x: any) => ({
        ...x,
        _id: new ObjectId(x._id),
        category: new ObjectId(x.category),
        subCategory: new ObjectId(x.subCategory),
        subSubCategory: new ObjectId(x.subSubCategory)
    }));
    return Promise.resolve();
}
