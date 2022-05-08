import { useProvidedContext } from '../components/providers/OverlayProvider';
import { ToasterContext } from '../components/providers/ToasterProvider';

export function useToaster() {
    return useProvidedContext('Toaster', ToasterContext);
}
