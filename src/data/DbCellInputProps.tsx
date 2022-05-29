import { ObjectSchema } from 'realm';
import { $ } from './$';

export class DbCellInputProps {
    static schema: ObjectSchema = {
        name: $.dbCellInputProps,
        embedded: true,
        properties: {
            toOutputFunction: $.dbDescriptor,
            displayName: $.optional.string,
            icon: $.optional.string,
            iconSize: $.optional.string,
            formatter: $.dbDescriptor,
            tooltipFunction: $.dbDescriptor,
            validatorFunctions: $.listOf.dbDescriptor
        }
    };
}
