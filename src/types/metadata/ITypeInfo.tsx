import { IColumnInfo } from './IColumnInfo';
import { IFieldInfo } from './IFieldInfo';
import { IPropertyInfo } from './IPropertyInfo';

export interface ITypeInfo {
    typeName: string;
    embedded: boolean;
    flatColumns: string[];
    columnInfos: Record<string, IColumnInfo>;
    ColGroup: JSX.Element;
    Headers: JSX.Element;
    Row: (props: { rowData: { _id: Realm.BSON.ObjectId } }) => JSX.Element;
    InputFormBody: () => JSX.Element; // JSX.Element[];
    EditFormBody: () => JSX.Element;
    Payload: RealmClass<any>;
}
