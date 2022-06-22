import { createContext } from 'react';
import { ControlOpts } from '../../hooks/useForm';
import { RegisterFunction } from '../../hooks/useRegister';
import { useProvidedContext } from './OverlayProvider';

export type IFormContext = [register: RegisterFunction, getFeedback: (x: string) => () => string, isFeedbacking: boolean];
export const FormContext = createContext<IFormContext | undefined>(undefined);

export function FormProvider({ children, register, isFeedbacking, getFeedback }: { children?: Children; register: RegisterFunction; getFeedback: (x: string) => () => string; isFeedbacking: boolean }) {
    return <FormContext.Provider value={[register, getFeedback, isFeedbacking]}>{children}</FormContext.Provider>;
}

export function useFormContext() {
    return useProvidedContext('Form', FormContext);
}
