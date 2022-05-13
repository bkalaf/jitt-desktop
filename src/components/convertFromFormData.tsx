import { setProperty } from '../common';
import { IColumnInfo } from '../types';
import { toDB } from './providers/DataTypeInfo';
import { toString } from '../common/toString';
import { handleFormDataValue } from './handleFormDataValue';
import { faGameConsoleHandheld } from '@fortawesome/pro-solid-svg-icons';
import { setReferenceField } from '../util';

export function convertFromFormData(obClass: () => any, getColumnInfo: (typeName: string, colName: string) => IColumnInfo, collection: string, realm?: Realm) {
    return async function (fd: FormData) {
        let dto = {};

        const data = Object.fromEntries(Array.from(fd.entries()));
        const result = Object.getOwnPropertyNames(data).map(async (name) => {
            const info = getColumnInfo(collection, name);
            if (info == null) return;
            if (info.flags.reference) {
                console.log('handling reference');
                dto = setProperty(name)(realm!.objectForPrimaryKey(info.objectType ?? '', new Realm.BSON.ObjectId(data[name].toString())))(dto);
                return;
            }
            const { datatype } = info;
            console.log('datatype', datatype);
            const func = toDB[datatype] ?? toString;
            console.log('func', func);
            const temp = await handleFormDataValue(func)(data[name]);
            console.log('temp', temp);
            dto = setProperty(name)(temp)(dto);
        });
        await Promise.all(result);
        return dto;
    };
}
