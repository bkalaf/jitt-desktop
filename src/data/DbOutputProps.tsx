import { ObjectSchema } from 'realm';
import { $ } from './$';


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
