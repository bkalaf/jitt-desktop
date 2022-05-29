import { ObjectId } from 'bson';
import { LinkedObject } from './LinkingObjects';
import { DbDataType } from "./DbDataType";
import { DbColumn } from "./DbColumn";
import { DbSort } from "./DbSort";
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
