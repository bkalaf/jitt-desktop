import { ObjectSchema } from 'realm';
import { $ } from './$';


export class DbTextAreaProps {
    static schema: ObjectSchema = {
        name: $.dbTextAreaProps,
        embedded: true,
        properties: {
            displayName: $.optional.string,
            required: $.bool,
            readOnly: $.bool,
            disabledFunction: $.dbDescriptor,
            defaultValue: $.optional.string,
            rows: $.optional.int
        }
    };
}
