import { IFieldInfo } from './IFieldInfo';
import { IPropertyInfo } from './IPropertyInfo';

export type IColumnInfo = IPropertyInfo & Partial<IFieldInfo>;
