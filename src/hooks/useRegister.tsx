import { FormContext } from '../components/providers/FormProvider';
import { useProvidedContext } from '../components/providers/OverlayProvider';

export function useRegister() {
    return useProvidedContext('Form', FormContext).register;
}
