import { fst } from '../common';
import { files } from '../config';
import { readFile } from '../common/fs/readFile';
import { now } from '../aggregator';
import { getOffsetDate } from './getOffsetDate';
import { Admin, Scrapes } from '../data';
import { $ } from '../data/$';
import { ActivityActions, ActivityScopes } from '../data/enums';

export function importBrands({
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
    scheduledItem: Admin.Activity | undefined;
    action: ActivityActions;
    scope: ActivityScopes;
}) {
    const data: string[] = JSON.parse(readFile(files.brandListings)).uniqueBrands.map(fst);
    const uniqueData = Array.from(new Set(data).values());
    const verifiedBrands = realm.objects<{ name: string }>($.verifiedBrand).map((x) => x.name);
    const dataNotIn = uniqueData.filter((x) => !verifiedBrands.includes(x));

    log(`potential imports: ${data.length}`)
    log(`unique imports: ${uniqueData.length}`)
    log(`data not currently in db: ${dataNotIn.length}`)

    let counter = 0;
    dataNotIn.forEach((x) => {
        realm.write(() => {
            counter++;
            if ((counter % 25) === 0) log(`writing #${counter}`);
            realm.create($.verifiedBrand, { _id: new Realm.BSON.ObjectId(), name: x });
        });
    });
    log(`done!`);
    
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
