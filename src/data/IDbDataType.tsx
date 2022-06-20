import { ObjectId } from 'bson';
import { LinkingObjects } from './LinkingObjects';
import { IDbControlProps, IDbProps } from './IDbControlProps';
import { IDbTable } from './IDbTable';

export type IDbDataType = {
    _id?: ObjectId;
    name?: string;
    basedOn?: IDbDataType;
    inheritedBy?: LinkingObjects<IDbDataType>;

    isOmitInsert?: boolean;
    isOmitEdit?: boolean;
    isOmitTabular?: boolean;
    isOmitGrid?: boolean;

    table?: IDbTable;
} & IDbControlProps &
    IDbProps;
