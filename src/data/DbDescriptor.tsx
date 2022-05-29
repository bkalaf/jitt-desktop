import { $ } from './$';

export class DbDescriptor {
    static schema = {
        name: $.dbDescriptor,
        primaryKey: '_id',
        properties: {
            _id: $.objectId,
            name: $.string,
            descriptor: $.string
        }
    };
}
