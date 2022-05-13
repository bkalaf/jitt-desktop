import { useProvidedContext } from '../components/providers/OverlayProvider';
import { ViewContext } from '../components/providers/ViewProvider';

export function useViewContext() {
    return useProvidedContext('ViewContext', ViewContext);
}
