import { Activity, Category, mongo, Taxonomy } from '../data';
import { ActivityScope } from "../ActivityScope";
import { ActivityAction } from "../ActivityAction";
import { files } from '../config';
import { readFile } from '../common/fs/readFile';
import { now } from '../aggregator';
import { getOffsetDate } from "./getOffsetDate";

export function importTaxonomy({
    onDemand = false, realm, log, scheduledItem, action, scope
}: {
    onDemand: boolean;
    realm: Realm;
    log: any;
    scheduledItem: Activity | undefined;
    action: ActivityAction;
    scope: ActivityScope;
}) {
    const data: Array<{ label: string; category: string; subcategory?: string; subsubcategory?: string; }> = JSON.parse(
        readFile(files.taxonomyListings)
    ).categories;
    log(`data.length: ${data.length}`);

    const categorySet = realm.objects<Category>(mongo.category);
    log(`categorySet.length: ${categorySet.length}`);
    const taxonomy = realm.objects<Taxonomy>(mongo.taxonomy);
    log(`taxonomy.length: ${taxonomy.length}`);

    const inserts = data.map((x) => {
        const id = x.subsubcategory ?? x.subcategory ?? x.category;
        log(`id: ${id}`);

        const categoryList = categorySet.filtered('id == $0', x.category);
        log(`categoryList: ${categoryList.length}`);

        const subcategoryList = categorySet.filtered('id == $0', x.subcategory);
        log(`subcategoryList.length: ${subcategoryList.length}`);

        const subsubcategoryList = categorySet.filtered('id == $0', x.subsubcategory);
        log(`subsubcategoryList.length: ${subsubcategoryList.length}`);

        const category = categoryList.length === 0 ? undefined : categoryList.length === 1 ? categoryList[0] : categoryList.filtered('label == $0', x.label)[0];
        log(`category:`, category);

        const subCategory = subcategoryList.length === 0 ? undefined : subcategoryList.length === 1 ? subcategoryList[0] : subcategoryList.filtered('label == $0', x.label)[0];
        log(`subCategory: `, subCategory);

        const subSubCategory = subsubcategoryList.length === 0
            ? undefined
            : subsubcategoryList.length === 1
                ? subsubcategoryList[0]
                : subsubcategoryList.filtered('label == $0', x.label)[0];
        log('subsubcategory:', subSubCategory);

        return {
            _id: new Realm.BSON.ObjectId(),
            category,
            subCategory,
            subSubCategory,
            selectors: [category?.id, subCategory?.id, subSubCategory?.id],
            materializedPath: [category?.label, subCategory?.label, subSubCategory?.label].join('::')
        };
    });

    try {
        const notInList = inserts.filter(x => x.subCategory != null && x.subSubCategory != null).filter((x) => taxonomy.every((y) => y.materializedPath !== x.materializedPath));
        console.log(`originalList: ${inserts.length}`);
        console.log(`notInList: ${notInList.length}`);

        notInList.forEach((item) => {
            log(`handling: ${JSON.stringify(item)}`);
            realm.write(() => {
                realm.create(mongo.taxonomy, item);
            });
        });
    } catch (error) {
        console.error((error as any).message);
    }

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
