import { ObjectSchema } from 'realm';
import { $ } from './$';


export class DbTable {
    static schema: ObjectSchema = {
        name: $.dbTable,
        primaryKey: '_id',
        properties: {
            _id: $.objectId,
            name: $.string,
            fields: $.listOf.dbColumn,
            embedded: $.bool,
            datatype: {
                type: $.linkingObjects,
                objectType: $.dbDataType,
                property: 'table'
            },
            sort: $.listOf.dbSort
        }
    };
}
