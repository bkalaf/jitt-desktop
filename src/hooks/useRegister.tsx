import { HTMLAttributes, SelectHTMLAttributes, InputHTMLAttributes } from 'react';
import { FormContext } from '../components/providers/FormProvider';
import { useProvidedContext } from '../components/providers/OverlayProvider';
import { IDefinitionProps } from '../data/definitions';
import { ControlOpts } from './useForm';


export type RegisterFunction = (name: string, opts: Omit<IDefinitionProps, 'children' | 'name'>) => Omit<IDefinitionProps, 'children' | 'validators' | 'convertFromFD' |'convertToFD' | 'toOutput' | 'pattern'> & { id: string, pattern?: string }

export function useRegister() {
    return useProvidedContext('Form', FormContext).register;
}
