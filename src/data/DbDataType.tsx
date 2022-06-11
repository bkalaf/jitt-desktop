import { ObjectSchema } from 'realm';
import { $ } from './$';

/**
 * @deprecated
 */
export class DbDataType {

    static schema: ObjectSchema = {
        name: $.dbDataType,
        primaryKey: '_id',
        properties: {
            _id: $.objectId,
            name: $.string,
            basedOn: $.dbDataType,
            inheritedBy: {
                type: $.linkingObjects,
                objectType: $.dbDataType,
                property: 'basedOn'
            },
            table: $.dbTable,
            validatorFunctions: $.listOf.dbDescriptor,
            displayName: $.optional.string,
            formatter: $.dbDescriptor,
            // controlType: $.string,
            inputProps: $.optional.dbInputProps,
            selectProps: $.optional.dbSelectProps,
            textAreaProps: $.optional.dbTextAreaProps,
            fieldSetProps: $.optional.dbFieldSetProps,
            outputProps: $.optional.dbOutputProps,
            cellInputProps: $.optional.dbCellInputProps,
            isOmitInsert: $.bool,
            isOmitEdit: $.bool,
            isOmitTabular: $.bool,
            isOmitGrid: $.bool,
        }
    };
}
