import { useProvidedContext } from '../components/providers/OverlayProvider';
import { SchemaContext } from '../components/providers/SchemaProvider';

/**
 * @deprecated
 */
export function useSchema() {
    return useProvidedContext('Schema', SchemaContext);
}
