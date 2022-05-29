import { IDbCellInputProps } from './IDbCellInputProps';
import { IDbDescriptor } from './IDbDescriptor';
import { IDbFieldSetProps } from './IDbFieldSetProps';
import { IDbInputProps } from './IDbInputProps';
import { IDbOutputProps } from './IDbOutputProps';
import { IDbSelectProps } from './IDbSelectProps';
import { IDbTextAreaProps } from './IDbTextAreaProps';

export type IDbControlProps = {
    displayName?: string;
    formatter?: IDbDescriptor;
    validatorFunctions?: IDbDescriptor[];
    
};

export type IDbProps = {
    inputProps?: IDbInputProps;
    selectProps?: IDbSelectProps;
    textAreaProps?: IDbTextAreaProps;
    fieldSetProps?: IDbFieldSetProps;
    outputProps?: IDbOutputProps;
    cellInputProps?: IDbCellInputProps;
}