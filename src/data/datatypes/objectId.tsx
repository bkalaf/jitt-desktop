import { faKey } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ObjectId } from 'bson';
import { toTitleCase } from '../../common';
import { isNotNil } from '../../common/isNotNull';
import { Input } from '../../components/forms/elements/Input';
import { useRegister } from '../../hooks/useRegister';

export function replaceOnce(toReplace: string) {
    return function (replacement: string) {
        return function (source = '') {
            if (isNotNil(toReplace)) {
                if (source.includes(toReplace)) {
                    return source.replace(toReplace, replacement);
                }
                return source;
            }
            return source;
        };
    };
}

export function replaceAll(toReplace: string) {
    return function (replacement: string) {
        return function (source = ''): string {
            if (!isNotNil(toReplace)) return source;
            const next = replaceOnce(toReplace)(replacement)(source);
            return next.includes(toReplace) ? replaceAll(toReplace)(replacement)(next) : next;
        };
    };
}

export type CellProps<T> = { value?: T; name: string };
export type ControlProps<T> = { name: string; id: string; labelId: string; value?: T };
export type LabelProps = { name: string; children?: string; controlId: string; id: string };
export function createPresenter<T>(props1: {
    initializer?: () => T;
    OutputCell: React.FunctionComponent<CellProps<T>>;
    EditCell: React.FunctionComponent<CellProps<T>>;
    InputControl: React.FunctionComponent<ControlProps<T>>;
    EditControl: React.FunctionComponent<ControlProps<T>>;
    LabelControl: React.FunctionComponent<LabelProps>;
    HeaderCell: React.FunctionComponent<LabelProps>;
    label?: string;
}) {
    const { OutputCell, EditCell, InputControl, EditControl, HeaderCell, LabelControl, label, initializer } = props1;
    return (props2: { value?: T; name: string; type: 'grid' | 'insert' | 'edit' }) => {
        const { type, value, name } = props2;
        const $label = label ?? toTitleCase(name);
        const controlId = `${replaceAll('.')('-')(name)}-control`;
        const labelId = `${controlId}-label`;
        const $value = value ?? (initializer != null ? initializer() : undefined);
        if (type === 'grid') {
            return [
                () => HeaderCell({ name, children: $label, id: labelId, controlId }),
                () => OutputCell({ value: $value, name }),
                () => EditCell({ value, name })
            ] as [header: React.FunctionComponent, outputCell: React.FunctionComponent, editCell: React.FunctionComponent];
        }
        if (type === 'insert') {
            return [
                () => LabelControl({ name, controlId, id: labelId, children: $label }),
                () => InputControl({ name, id: controlId, labelId: labelId, value: $value })
            ] as [labelComponent: React.FunctionComponent, controlComponent: React.FunctionComponent];
        }
        if (type === 'edit') {
            return [
                () => LabelControl({ name, controlId, id: labelId, children: $label }),
                () => EditControl({ name, id: controlId, labelId, value: $value })
            ] as [labelComponent: React.FunctionComponent, controlComponent: React.FunctionComponent];
        }
    };
}

// const forString = createPresenter<string>({
//     initializer: () => '',
//     OutputCell: ({ value, name }: CellProps<string>) => {},
//     EditCell: ({ value, name }: CellProps<string>) => {},
//     HeaderCell: ({}: LabelProps) => {},
//     LabelControl: ({}: LabelProps) => {},
//     InputControl: ({}: ControlProps<string>) => {},
//     EditControl: ({}: ControlProps<string>) => {},

// })


