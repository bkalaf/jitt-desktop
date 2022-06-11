import { ObjectSchema } from 'realm';
import { $ } from './$';

/**
 * @deprecated
 */
export class DbColumn {
    static schema: ObjectSchema = {
        name: $.dbColumn,
        primaryKey: '_id',
        properties: {
            _id: $.objectId,
            table: {
                type: $.linkingObjects,
                objectType: $.dbTable,
                property: 'fields'
            },
            name: $.string,
            datatype: $.dbDataType,
            controlType: $.string,
            cellType: $.string,
            inputProps: $.optional.dbInputProps,
            selectProps: $.optional.dbSelectProps,
            textAreaProps: $.optional.dbTextAreaProps,
            fieldSetProps: $.optional.dbFieldSetProps,
            outputProps: $.optional.dbOutputProps,
            cellInputProps: $.optional.dbCellInputProps,
            displayName: $.optional.string,
            formatter: $.dbDescriptor,
            validatorFunctions: $.listOf.dbDescriptor
        }
    };
}
