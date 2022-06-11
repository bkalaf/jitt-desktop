import { ObjectSchema } from 'realm';
import { $ } from './$';

/**
 * @deprecated
 */
export class DbFieldSetProps {

    static schema: ObjectSchema = {
        name: $.dbFieldSetProps,
        embedded: true,
        properties: {
            displayName: $.optional.string,
            required: $.bool,
            summaryFunction: $.dbDescriptor,
            span: $.int
        }
    };
}
