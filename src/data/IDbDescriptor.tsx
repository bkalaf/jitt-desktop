import { ObjectId } from 'bson';

export type IDbDescriptor = {
    _id: ObjectId;
    name: string;
    descriptor: string;
}
