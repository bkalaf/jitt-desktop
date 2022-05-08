import { createContext } from 'react';
import { ControlOpts } from '../../hooks/useForm';
import { useProvidedContext } from './OverlayProvider';

export type IFormContext = {
    register: (name: string, opts?: ControlOpts) => React.HTMLAttributes<DataElement>;
};
export const FormContext = createContext<IFormContext | undefined>(undefined);

export function FormProvider({
    children,
    register
}: {
    children?: Children;
    register: (name: string, opts?: ControlOpts) => React.HTMLAttributes<DataElement>;
}) {
    return <FormContext.Provider value={{ register }}>{children}</FormContext.Provider>;
}

export function useFormContext() {
    return useProvidedContext('Form', FormContext);
}
