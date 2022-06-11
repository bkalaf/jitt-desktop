import { ObjectId } from 'bson';
import { LinkedObject } from './LinkingObjects';
import { IDbSort } from './IDbSort';
import { IDbColumn } from './IDbColumn';
import { IDbDataType } from './IDbDataType';

export type IDbTable = {
    _id: ObjectId;
    name: string;
    fields: IDbColumn[];
    datatype: LinkedObject<IDbDataType>;
    embedded: boolean;
    sort: IDbSort[];
};
