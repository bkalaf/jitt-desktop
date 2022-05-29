import { createContext } from 'react';
import { ControlOpts } from '../../hooks/useForm';
import { RegisterFunction } from '../../hooks/useRegister';
import { useProvidedContext } from './OverlayProvider';

export type IFormContext = {
    register: RegisterFunction;
};
export const FormContext = createContext<IFormContext | undefined>(undefined);

export function FormProvider({
    children,
    register
}: {
    children?: Children;
    register: RegisterFunction;
}) {
    return <FormContext.Provider value={{ register }}>{children}</FormContext.Provider>;
}

export function useFormContext() {
    return useProvidedContext('Form', FormContext);
}
