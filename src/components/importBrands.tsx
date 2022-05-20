import { fst } from '../common';
import { Activity, mongo, VerifiedBrand } from '../data';
import { ActivityScope } from "../ActivityScope";
import { ActivityAction } from "../ActivityAction";
import { files } from '../config';
import { readFile } from '../common/fs/readFile';
import { now } from '../aggregator';
import { getOffsetDate } from "./getOffsetDate";

export function importBrands({
    onDemand = false, realm, log, scheduledItem, action, scope
}: {
    onDemand: boolean;
    realm: Realm;
    log: any;
    scheduledItem: Activity | undefined;
    action: ActivityAction;
    scope: ActivityScope;
}) {
    const data: string[] = JSON.parse(readFile(files.brandListings)).uniqueBrands.map(fst);
    const uniqueData = Array.from(new Set(data).values());
    const verifiedBrands = realm.objects<VerifiedBrand>(mongo.verifiedBrand).map((x) => x.name);
    const dataNotIn = uniqueData.filter((x) => !verifiedBrands.includes(x));

    dataNotIn.forEach((x) => {
        realm.write(() => {
            log(`handling: ${x}`);
            realm.create(mongo.verifiedBrand, { _id: new Realm.BSON.ObjectId(), name: x });
        });
    });

    if (!onDemand) {
        if (scheduledItem) {
            realm.write(() => {
                scheduledItem.isComplete = true;
                scheduledItem.isScheduled = false;
                realm.create<Activity>(mongo.activity, {
                    _id: new Realm.BSON.ObjectId(),
                    action,
                    scope,
                    when: getOffsetDate(14),
                    isComplete: false,
                    isScheduled: true
                });
            });
        } else {
            realm.write(() => {
                realm.create<Activity>(mongo.activity, {
                    _id: new Realm.BSON.ObjectId(),
                    action,
                    scope,
                    when: now(),
                    isComplete: true,
                    isScheduled: false
                });
                realm.create<Activity>(mongo.activity, {
                    _id: new Realm.BSON.ObjectId(),
                    action,
                    scope,
                    when: getOffsetDate(14),
                    isComplete: false,
                    isScheduled: true
                });
            });
        }
    } else {
        realm.write(() => {
            realm.create<Activity>(mongo.activity, {
                _id: new Realm.BSON.ObjectId(),
                action,
                scope,
                when: now(),
                isComplete: true,
                isScheduled: false
            });
            realm.create<Activity>(mongo.activity, {
                _id: new Realm.BSON.ObjectId(),
                action,
                scope,
                when: getOffsetDate(14),
                isComplete: false,
                isScheduled: true
            });
        });
    }

    return Promise.resolve();
}
