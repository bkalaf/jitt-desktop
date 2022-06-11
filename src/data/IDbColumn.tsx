import { ObjectId } from 'bson';
import { IDbTable } from './IDbTable';
import { IDbControlProps, IDbProps } from './IDbControlProps';
import { IDbDataType } from './IDbDataType';
import { CellType, ControlType } from '.';

export type IDbColumn = {
    _id: ObjectId;
    name: string;
    table: IDbTable;
    datatype?: IDbDataType;
    controlType?: ControlType;
    cellType?: CellType;
} & IDbControlProps & IDbProps;
