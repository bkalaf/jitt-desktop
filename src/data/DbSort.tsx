import { ObjectSchema } from 'realm';
import { $ } from './$';

export class DbSort {
    static schema: ObjectSchema = {
        name: $.dbSort,
        embedded: true,
        properties: {
            column: $.string,
            isDescending: $.bool
        }
    };
}
