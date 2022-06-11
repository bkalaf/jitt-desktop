import { ObjectSchema } from 'realm';
import { $ } from './$';

/**
 * @deprecated
 */
export class DbOutputProps {
    static schema: ObjectSchema = {
        name: $.dbOutputProps,
        embedded: true,
        properties: {
            displayName: $.optional.string,
            accessorName: $.optional.string,
            accessorFunction: $.dbDescriptor
        }
    };
}
