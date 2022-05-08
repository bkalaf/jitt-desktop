import { IPrimitive, IType, TypeCells, TypeControls } from './IType';
import { toTitleCase } from '../../common/text/toTitleCase';
import {
    objectIdPrimitive,
    boolPrimitive,
    intPrimitive,
    doublePrimitive,
    floatPrimitive,
    decimal128Primitive,
    stringPrimitive,
    datePrimitive,
    dataPrimitive
} from './SchemaProvider';

export function colTypes(
    index: number,
    name: string,
    label?: string,
    optional = true,
    indexed = false,
    control = 'input' as TypeControls,
    cell = 'text' as TypeCells,
    ...validators: Array<(x: any) => boolean | string>
): Record<string, IPrimitive<any> & IType> {
    return {
        objectId: {
            name,
            index,
            optional,
            indexed,
            control,
            cell,
            validators,
            ...{ label: label ?? toTitleCase(name) },
            ...objectIdPrimitive
        },
        bool: { name, label: label ?? toTitleCase(name), index, optional, indexed, control, cell, validators, ...boolPrimitive },
        int: { name, label: label ?? toTitleCase(name), index, optional, indexed, control, cell, validators, ...intPrimitive },
        double: { name, label: label ?? toTitleCase(name), index, optional, indexed, control, cell, validators, ...doublePrimitive(2) },
        float: { name, label: label ?? toTitleCase(name), index, optional, indexed, control, cell, validators, ...floatPrimitive(4) },
        decimal128: {
            name,
            label: label ?? toTitleCase(name),
            index,
            optional,
            indexed,
            control,
            cell,
            validators,
            ...decimal128Primitive(4)
        },
        string: { name, label: label ?? toTitleCase(name), index, optional, indexed, control, cell, validators, ...stringPrimitive },
        date: { name, label: label ?? toTitleCase(name), index, optional, indexed, control, cell, validators, ...datePrimitive },
        data: { name, label: label ?? toTitleCase(name), index, optional, indexed, control, cell, validators, ...dataPrimitive },
        email: {
            name,
            label: label ?? toTitleCase(name),
            index,
            optional,
            indexed,
            control,
            cell,
            validators,
            ...stringPrimitive,
            inputType: 'email'
        },
        url: {
            name,
            label: label ?? toTitleCase(name),
            index,
            validators,
            optional,
            indexed,
            control,
            cell,
            ...stringPrimitive,
            inputType: 'url'
        },
        tel: {
            name,
            label: label ?? toTitleCase(name),
            index,
            validators,
            optional,
            indexed,
            control,
            cell,
            ...stringPrimitive,
            inputType: 'tel'
        },
        password: {
            ...{ name, label: label ?? toTitleCase(name), index, optional, indexed, control, cell, validators, ...stringPrimitive },
            inputType: 'password'
        }
    };
}
