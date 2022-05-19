import { identity } from '../../common/identity';
import { padZero } from '../../common/text/padZero';
import { ObjectId } from 'bson';
import { FieldsetHTMLAttributes, OlHTMLAttributes, TdHTMLAttributes } from 'react';
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// TODO Extract
export const toOutput: Record<string, (x: any) => string> = {
    objectId: (x: ObjectId) => x.toHexString(),
    string: identity,
    int: (x: number) => x.toFixed(0),
    float: (x: number) => x.toFixed(4),
    double: (x: number) => x.toFixed(2),
    decimal128: (x: number) => x.toString(),
    bool: (x: boolean) => (x ? 'true' : 'false'),
    date: (x: Date) =>
        x == null
            ? ''
            : [
                  [padZero(2)(x.getMonth() + 1), padZero(2)(x.getDate()), x.getFullYear()].join('/'),
                  [
                      [padZero(2)(x.getHours() === 0 ? 12 : x.getHours() > 13 ? x.getHours() - 12 : x.getHours()), padZero(2)(x.getMinutes())].join(':'),
                      x.getHours() >= 12 ? 'PM' : 'AM'
                  ].join(' ')
              ].join(' '),
    data: (x: ArrayBuffer) => {
        function inner() {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(new Blob([x]));
                reader.addEventListener('loadend', () => {
                    resolve(reader.result as string);
                });
            });
        }
        return 'junk';
    }
};
export const toDB: Record<string, (x: string) => any> = {
    objectId: (x: string) => new ObjectId(x),
    int: (x: string) => parseInt(x, 10),
    float: (x: string) => parseFloat(x),
    double: (x: string) => parseFloat(x),
    decimal128: (x: string) => parseFloat(x),
    bool: (x: string) => x === 'true',
    string: identity,
    date: (x: string) => new Date(Date.parse(x)),
    data: async (x: string) => new Blob([x]).arrayBuffer()
};
export interface DataTypeInfo {
    type: string;
    objectType?: string;
    property?: string;
    optional: boolean;
    indexed: boolean;
}

// export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//     inputType: HTMLInputTypeAttribute;
//     name: string;
//     dataType: DataTypeInfo;
// }
// export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
//     enumMap?: Record<string, string>;
//     name: string;

//     dataType: DataTypeInfo;
// }
// export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
//     name: string;
//     dataType: DataTypeInfo;
// }
// export interface OutputProps extends React.OutputHTMLAttributes<HTMLOutputElement> {
//     name: string;
//     dataType: DataTypeInfo;
// }
// export interface FieldSetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
//     name: string;
//     dataType: DataTypeInfo;
// }
// export type ControlProps = FieldSetProps | OutputProps | TextAreaProps | InputProps | SelectProps;
export interface CellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
    icon?: IconDefinition;
    displayAs?: string;
    name: string;
    dataType: DataTypeInfo;
}
export interface PropertyInfo {
    dataType: DataTypeInfo;
    name: string;
    Control: <T extends React.HTMLAttributes<HTMLElement>>(x: T) => JSX.Element;
    Cell: (x: CellProps) => JSX.Element;
    props: any;
}
export function ListElement(props: OlHTMLAttributes<HTMLOListElement>) {
    return <ol {...props}></ol>;
}
export function FieldSet(props: FieldsetHTMLAttributes<HTMLFieldSetElement>) {
    return <fieldset {...props} />;
}
export function IconCell(props: TdHTMLAttributes<HTMLTableCellElement> & { icon: IconDefinition; children: string }) {
    return (
        <td {...props} title={props.children}>
            <FontAwesomeIcon icon={props.icon} size='lg' />
        </td>
    );
}
export function TableCell(props: TdHTMLAttributes<HTMLTableCellElement>) {
    return <td {...props}></td>;
}
