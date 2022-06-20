import { CellType, ControlType } from '.';
import { isNotNil } from '../common/isNotNull';
import { IDbColumn } from './IDbColumn';
import { IDbProps } from './IDbControlProps';
import { IDbDataType } from './IDbDataType';
import { IDbTable } from './IDbTable';

export function cascadeProps(item: IDbProps) {
    if (item.fieldSetProps) return [item.fieldSetProps, item.cellInputProps];
    if (item.outputProps) return [item.outputProps, item.cellInputProps];
    if (item.textAreaProps) return [item.textAreaProps, item.cellInputProps];
    if (item.selectProps) return [item.selectProps, item.cellInputProps];
    return [item.inputProps, item.cellInputProps];
}

export function objectMerge(item1: Record<string, any> = {}, item2: Record<string, any> = {}) {
    if (Object.getOwnPropertyNames(item1).length === 0 && Object.getOwnPropertyNames(item2).length === 0) return undefined;
    return { ...item1, ...item2 };
}
export function mergeDataType(item: IDbDataType , item2: IDbDataType): IDbDataType {
    const returnItem = {
        name: item2.name ?? item.name,
        cellInputProps: objectMerge(item2.cellInputProps, item.cellInputProps),
        displayName: item2.displayName ?? item.displayName,
        fieldSetProps: objectMerge(item2.fieldSetProps, item.fieldSetProps),
        formatter: item2.formatter ?? item.formatter,
        selectProps: objectMerge(item2.selectProps, item.selectProps),
        inputProps: objectMerge(item2.inputProps, item.inputProps),
        outputProps: objectMerge(item2.outputProps, item.outputProps),
        validOn: [ item2.isOmitEdit || item.isOmitEdit ? null : 'edit', 
            item2.isOmitInsert || item.isOmitInsert ? null : 'insert',
            item2.isOmitGrid || item.isOmitGrid ? null : 'grid',
            item2.isOmitTabular || item.isOmitTabular ? null : 'tabular'].filter(isNotNil),
        table: item2.table ?? item.table,
        validatorFunctions: [...item2.validatorFunctions ?? [], ...item.validatorFunctions ?? []],
        textAreaProps: objectMerge(item2.textAreaProps, item.textAreaProps)
    };   
    console.log(`mergeDataType`, item, item2, returnItem);
    return returnItem as IDbDataType;
}

export function checkLineage(item: IDbDataType): IDbDataType {
    if (item.basedOn == null) {
        return item;
    }
    return mergeDataType(item, checkLineage(item.basedOn));
}
export function handleColumn(column: IDbColumn): IDbDataType & {
    cellType?: CellType, controlType?: ControlType, lookupTable?: IDbTable
} {
    const effectiveDataType = checkLineage(column.datatype ?? {});
    const effectiveProps = {
        cellInputProps: objectMerge(column.cellInputProps, effectiveDataType.cellInputProps),
        inputProps: objectMerge(column.inputProps, effectiveDataType.cellInputProps),
        selectProps: objectMerge(column.selectProps, effectiveDataType.selectProps),
        outputProps: objectMerge(column.outputProps, effectiveDataType.outputProps),
        fieldSetProps: objectMerge(column.fieldSetProps, effectiveDataType.fieldSetProps),
        textAreaProps: objectMerge(column.textAreaProps, effectiveDataType.textAreaProps),
        cellType: column.cellType,
        controlType: column.controlType,
        displayName: column.displayName ?? effectiveDataType.displayName,
        formatter: column.formatter ?? effectiveDataType.formatter,
        table: column.table,
        lookupTable: effectiveDataType.table,
        name: column.name,
        validatorFunctions: [...column.validatorFunctions ?? [], ...effectiveDataType.validatorFunctions ?? []]
    };
    console.log(`effective`, effectiveDataType, effectiveDataType, column);
    return effectiveProps as IDbDataType;
}

export function solveColumn(column: IDbColumn) {
    const {
        cellInputProps,
        inputProps,
        selectProps,
        outputProps,
        fieldSetProps,
        textAreaProps,
        cellType,
        controlType,
        displayName,
        formatter,
        table,
        lookupTable,
        name,
        validatorFunctions,
        ...remain
    } = handleColumn(column);
    const control = outputProps ? ['Output', 'Summary', outputProps, cellInputProps] : inputProps ? ['Input', 'Value', inputProps, cellInputProps] : fieldSetProps ? ['FieldSet', 'Embedded', fieldSetProps, cellInputProps] : textAreaProps ? ['TextArea', 'Value', textAreaProps, cellInputProps] : selectProps ? lookupTable ? ['Lookup', 'Summary', selectProps, cellInputProps] : selectProps.multiple ? ['MultiSelect', 'Value'] : Object.getOwnPropertyNames(selectProps.enumMap).length > 10 ? ['SingleSelect', 'Value'] : ['Radio', 'Value'] : ['', ''];
}