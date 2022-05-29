import { IDbControlProps } from './IDbControlProps';
import { IDbDescriptor } from './IDbDescriptor';

export type IDbCellInputProps = {
    toOutputFunction?: IDbDescriptor;
    icon?: string;
    iconSize?: string;
    tooltipFunction?: IDbDescriptor;
} & IDbControlProps;
