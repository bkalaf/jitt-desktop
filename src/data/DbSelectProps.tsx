import { ObjectSchema } from 'realm';
import { $ } from './$';

/**
 * @deprecated
 */
export class DbSelectProps {
    static schema: ObjectSchema = {
        name: $.dbSelectProps,
        embedded: true,
        properties: {
            displayName: $.optional.string,
            required: $.bool,
            disabledFunction: $.dbDescriptor,
            defaultValue: $.optional.string,
            optionValue: $.optional.string,
            optionLabel: $.optional.string,
            enumMap: $.dictionaryOf.string,
            multiple: $.bool,
            size: $.optional.int,
            sort: $.listOf.dbSort,
            filter: $.optional.string,
            convertToFD: $.dbDescriptor,
            convertFromFD: $.dbDescriptor
        }
    };
}
