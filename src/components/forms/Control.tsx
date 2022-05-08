/* eslint-disable react/boolean-prop-naming */
import React from 'react';
import { IndicatorGroup } from '../Indicator';
import { useRegister } from '../../hooks/useRegister';
import { FormEl, FormElement } from './elements/Input';

export type IControlProps<TAttributes extends React.HTMLAttributes<DataElement | HTMLOutputElement>> = {
    label: string;
    name: string;
    feedback?: string;
    showFeedback?: boolean;
    tag: string;
    stringify?: (x: any) => string;
    El: FormEl;
} & TAttributes;

// export function CellHeader<TAttributes extends React.HTMLAttributes<DataElement | HTMLOutputElement>>(props: IControlProps<TAttributes>) {
//     return <th>{props.label}</th>
// }
// export function Field<TAttributes extends React.HTMLAttributes<DataElement | HTMLOutputElement>>(props: { name: string, label?: string, stringify?: (x: any) => string, children: (props: TAttributes) => JSX.Element } ) {
//     const { children, ...remain } = props;
//     return props.children({ name: remain.name, label: remain.label ?? toTitleCase(remain.name), stringify: remain.stringify ?? ((x: any) => x.toString()) })
// }
export function Control<TAttributes extends React.HTMLAttributes<DataElement | HTMLOutputElement>>(props: IControlProps<TAttributes>) {
    console.group('Control');
    const { name, label, feedback, showFeedback, tag, El, ...remain } = props;
    const controlID = `${props.name}-control`;
    const labelID = `${controlID}-label`;
    const feedbackID = `${controlID}-feedback`;
    const register = useRegister();
    console.log(`remain`, name, controlID, remain);
    console.groupEnd();
    return (
        <div className='relative flex flex-col'>
            <label id={labelID} htmlFor={controlID} className='flex text-lg font-bold leading-loose tracking-wider font-fira-sans indent-3'>
                {label}
            </label>
            <IndicatorGroup tag={tag} />
            <El id={controlID} {...(register(name, remain as any) as TAttributes)} />
            <small id={feedbackID} className='hidden text-base peer'>
                {feedback}
            </small>
        </div>
    );
}
