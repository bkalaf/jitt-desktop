import path from 'path';
import { checkDirectory } from '../common/fs/checkDirectory';
import { APP_CONFIG } from '../config';
import { invertMimeTypes } from '../data/enums/mimeTypes';
import * as fs from 'graceful-fs';
import { Files } from '../data/index';
import { $ } from '../data/$';

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

export function updateFile(realm: Realm, collection: string) {
    return async function ({ id, data }: { id: string; data: Record<string, any> }) {
        const obj = realm.objectForPrimaryKey<Files.FileAlloc>(collection, new Realm.BSON.ObjectId(id));
        if (obj == null) throw new Error('null obj');

        const orig = obj.path;
        realm.write(() => {
            Object.entries(data).forEach(([k, v]) => {
                (obj as any)[k] = v;
            });
        });
        const dest = obj.path;
        return [orig, dest] as [string, string];
    };
}
export function uploadFile(realm: Realm) {
    return function (files: File[]) {
        async function inner(file: File) {
            const alloc = {} as any;
            alloc.originalName = file.path;
            alloc.name = file.name;
            alloc.materializedPath = `/${file.name}`;
            alloc.fileCreation = new Date(file.lastModified);
            alloc._id = new Realm.BSON.ObjectId();
            const fsItem = {} as any;
            fsItem.data = await file.arrayBuffer();
            fsItem.size = file.size;
            fsItem.mimeType = invertMimeTypes[file.type];
            fsItem._id = new Realm.BSON.ObjectId();
            alloc.fsItem = fsItem;

            console.log(`alloc`, alloc);
            realm.write(() => {
                const result: any = realm.create<Files.FileAlloc>($.fsAlloc, alloc, Realm.UpdateMode.All);
                const source = result.originalName;
                const destination = [APP_CONFIG.fs.path, result.name].join('/');
                checkDirectory(path.dirname(destination));
                fs.renameSync(source, destination);
            });
            return Promise.resolve();
        }

        return Promise.all(files.map(inner));
    };
}
