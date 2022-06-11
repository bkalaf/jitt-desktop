import { ObjectSchema } from 'realm';
import { $ } from './$';

/**
 * @deprecated
 */
export class DbInputProps {

    static schema: ObjectSchema = {
        name: $.dbInputProps,
        embedded: true,
        properties: {
            displayName: $.optional.string,
            required: $.bool,
            readOnly: $.bool,
            disabledFunction: $.bool,
            defaultValue: $.optional.string,
            min: $.optional.double,
            max: $.optional.double,
            minLength: $.optional.int,
            maxLength: $.optional.int,
            pattern: $.optional.string,
            type: $.optional.string,
            formatter: $.dbDescriptor,
            convertFromFD: $.dbDescriptor,
            convertToFD: $.dbDescriptor,
            initializerFunction: $.dbDescriptor,
            placeholder: $.optional.string,
            validatorFunctions: $.listOf.dbDescriptor
        }
    };
}
