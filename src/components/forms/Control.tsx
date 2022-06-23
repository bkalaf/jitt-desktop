/* eslint-disable react/boolean-prop-naming */
import React, { HTMLInputTypeAttribute } from 'react';
import { useRegister } from '../../hooks/useRegister';
import { FormEl } from './elements/Input';
import { DuotoneIcon } from '../icons/DuotoneIcon';
import { faCalculatorSimple, faExclamationTriangle, faGlasses, faLightbulbExclamation, faSpaceStationMoonConstruction, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { toTitleCase } from '../../common';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IDefinitionProps } from '../../data/definitions';

export type IControlProps<TAttributes extends React.HTMLAttributes<DataElement | HTMLOutputElement>> = {
    label?: string;
    name: string;
    feedback?: string;
    showFeedback?: boolean;
    stringify?: (x: any) => string;
    El: React.FunctionComponent<any>;
    icon?: IconDefinition;
    iconSize?: SizeProp;
    tooltipFunction?: string;
    required?: boolean;
    readOnly?: boolean;
    maxLength?: number;
    type?: HTMLInputTypeAttribute;
    horiz?: boolean;
    noLabel?: boolean;
} & TAttributes &
    Omit<IDefinitionProps, 'Field' | 'Control' | 'children'>;

export function Control<TAttributes extends React.HTMLAttributes<DataElement | HTMLOutputElement>>(props: IControlProps<TAttributes>) {
    const { name, horiz, label, noLabel, showFeedback, El, id, icon, iconSize, ...remain } = props;
    const controlID = id ?? `${props.name.split('.').reverse()[0]}-control`;
    const labelID = `${controlID}-label`;
    const feedbackID = `${controlID}-feedback`;
    const [register, getFeedback, isFeedbacking] = useRegister();
    const spread = register(name, remain as any) as React.InputHTMLAttributes<HTMLInputElement>;

    return (
        <div className='relative flex flex-col'>
            <div className={`${horiz ?? false ? 'flex flex-row' : 'contents'}`}>
                <label id={labelID} htmlFor={controlID} className='flex text-lg font-bold leading-loose tracking-wider text-left text-white font-fira-sans indent-3'>
                    {noLabel ? undefined : label ?? toTitleCase(name)}
                </label>
                {/* <El {...spread} /> */}
                {El!({
                    name,
                    register: register,
                    className: 'flex text-black bg-white border border-black py-0.5 px-2 font-fira-sans font-normal text-base rounded-lg shadow-inner shadow-black peer',
                    toOutput: remain.toOutput,
                    ...({ ...spread } as any)
                })}
            </div>
            {isFeedbacking && (
                <small id={feedbackID} className='flex text-base'>
                    {getFeedback(name)()}
                </small>
            )}
            <ol className='absolute top-0 right-0 flex flex-row space-x-1'>
                {(spread?.required ?? false) && (
                    <li className='flex'>
                        <DuotoneIcon icon={faExclamationTriangle} primary='red' secondary='orange' size='lg' title='Field is required.' />
                    </li>
                )}
                {(spread?.readOnly ?? false) && (
                    <li className='flex'>
                        <DuotoneIcon icon={faGlasses} primary='lime' secondary='aqua' size='lg' title='Field is read-only.' />
                    </li>
                )}
                {(spread?.disabled ?? false) && (
                    <li className='flex'>
                        <DuotoneIcon icon={faSpaceStationMoonConstruction} primary='yellow' secondary='blue' size='lg' title='Field is disabled.' />
                    </li>
                )}
                {El.displayName === 'Output' ||
                    (El.displayName === 'OutputEle' && (
                        <li className='flex'>
                            <DuotoneIcon icon={faCalculatorSimple} primary='violet' secondary='darkviolet' size='lg' title='Field is calculated.' />
                        </li>
                    ))}
            </ol>
        </div>
    );
}
