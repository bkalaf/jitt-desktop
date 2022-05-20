import { Activity, Category, mongo } from '../data';
import { ActivityScope } from "../ActivityScope";
import { ActivityAction } from "../ActivityAction";
import { files } from '../config';
import { readFile } from '../common/fs/readFile';
import { now } from '../aggregator';
import { getOffsetDate } from "./getOffsetDate";

export function importCategories({
    onDemand = false, realm, log, scheduledItem, action, scope
}: {
    onDemand: boolean;
    realm: Realm;
    log: any;
    scheduledItem: Activity | undefined;
    action: ActivityAction;
    scope: ActivityScope;
}) {
    const data: Array<{ label: string; category: string; subcategory?: string; subsubcategory?: string; id: string; }> = JSON.parse(
        readFile(files.categoryListings)
    ).categories;

    const dbCategories = realm.objects<Category>(mongo.category);
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
            realm.create(mongo.category, i);
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
