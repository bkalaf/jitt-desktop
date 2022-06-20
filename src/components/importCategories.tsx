import {  Admin, Scrapes } from '../data';
import { files } from '../config';
import { readFile } from '../common/fs/readFile';
import { now } from '../aggregator';
import { getOffsetDate } from './getOffsetDate';
import { ActivityActions, ActivityScopes } from '../data/enums';
import { $ } from '../data/$';

export function importCategories({
    onDemand = false,
    realm,
    log,
    scheduledItem,
    action,
    scope
}: {
    onDemand: boolean;
    realm: Realm;
    log: any;
    scheduledItem: any | undefined;
    action: ActivityActions;
    scope: ActivityScopes;
}) {
    const data: Array<{ label: string; category: string; subcategory?: string; subsubcategory?: string; id: string }> = JSON.parse(
        readFile(files.categoryListings)
    ).categories;

    const dbCategories = realm.objects<Scrapes.Category>($.category);
    const inserts = data.map((x) => {
        const id = x.subsubcategory ?? x.subcategory ?? x.category;
        const label = x.label;
        const node = id.startsWith('category') ? 1 : id.startsWith('subCategory') ? 2 : 3;
        return {
            _id: new Realm.BSON.ObjectId(),
            id,
            label,
            node
        };
    });
    const notInRealm = inserts.filter((x) => !dbCategories.some((y) => x.id === y.id && x.label === y.label && x.node === y.node));

    notInRealm.forEach((i) => {
        realm.write(() => {
            log(`handling: ${JSON.stringify(i)}`);
            realm.create($.category, i);
        });
    });

    if (!onDemand) {
        if (scheduledItem) {
            realm.write(() => {
                scheduledItem.isComplete = true;
                scheduledItem.isScheduled = false;
                realm.create<Admin.Activity>($.activity, {
                    _id: new Realm.BSON.ObjectId(),
                    action,
                    scope,
                    when: getOffsetDate(14),
                    isComplete: false,
                    isScheduled: true
                } as any);
            });
        } else {
            realm.write(() => {
                realm.create<Admin.Activity>($.activity, {
                    _id: new Realm.BSON.ObjectId(),
                    action,
                    scope,
                    when: now(),
                    isComplete: true,
                    isScheduled: false
                } as any);
                realm.create<Admin.Activity>($.activity, {
                    _id: new Realm.BSON.ObjectId(),
                    action,
                    scope,
                    when: getOffsetDate(14),
                    isComplete: false,
                    isScheduled: true
                } as any);
            });
        }
    } else {
        realm.write(() => {
            realm.create<Admin.Activity>($.activity, {
                _id: new Realm.BSON.ObjectId(),
                action,
                scope,
                when: now(),
                isComplete: true,
                isScheduled: false
            } as any);
            realm.create<Admin.Activity>($.activity, {
                _id: new Realm.BSON.ObjectId(),
                action,
                scope,
                when: getOffsetDate(14),
                isComplete: false,
                isScheduled: true
            } as any);
        });
    }

    return Promise.resolve();
}
