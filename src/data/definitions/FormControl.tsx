import { faGlasses } from '@fortawesome/pro-duotone-svg-icons';
import React from 'react';
import { useMemo } from 'react';
import { DuotoneIcon } from '../../components/icons/DuotoneIcon';
import { useRegister } from '../../hooks/useRegister';
import { faExclamationCircle } from '@fortawesome/pro-duotone-svg-icons';
import { IDefinitionProps } from './index';

export function FormControl(
    props: Omit<IDefinitionProps, 'children'> & {
        getFeedback: (name: string) => () => string;
        isFeedbacking: boolean;
    }
) {
    const { Control, displayName, name, optionLabel, optionValue, isFeedbacking, getFeedback, ...remain } = props;
    const register = useRegister();
    const feedback = useMemo(() => getFeedback(name)(), [getFeedback, name]);
    return (
        <div className='relative flex flex-col'>
            <label className='flex' id='' htmlFor=''>
                {displayName}
            </label>
            {Control!({
                name,
                register: register,
                className:
                    'flex text-black bg-white border border-black py-0.5 px-2 font-fira-sans font-normal text-base rounded-lg shadow-inner shadow-black peer',
                ...({ ...remain, optionLabel, optionValue } as any)
            })}
            {isFeedbacking && <small className='flex'>{feedback}</small>}
            <DuotoneIcon
                icon={faExclamationCircle}
                size='lg'
                primary='white'
                secondary='red'
                title='Field is required'
                noBlock
                className='absolute mr-1.5 mt-1.5 right-0 top-0 hidden peer-required:inline-flex w-7 h-7'
            />
            <DuotoneIcon
                icon={faGlasses}
                size='lg'
                primary='white'
                secondary='orange'
                title='Field is required'
                noBlock
                className='absolute mr-1.5 mt-1.5 right-0 top-0 hidden peer-readOnly:inline-flex w-7 h-7'
            />
        </div>
    );
}
