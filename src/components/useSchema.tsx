import { useProvidedContext } from './providers/OverlayProvider';
import { SchemaContext } from './providers/SchemaProvider';

export function useSchema() {
    return useProvidedContext('Schema', SchemaContext);
}
