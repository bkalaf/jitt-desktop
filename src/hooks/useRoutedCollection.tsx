import { useLocation } from 'react-router-dom';
import { getCaptureGroups } from '../components/providers/getCaptureGroups';

const COLLECTION_REGEX = /\/\w*\/v1\/?([\w-]*)\/?([\w-]*)/;

export function useRoutedCollection(reqNotNull = false): [string, string] {
    const location = useLocation();
    const [ collectionName, id] = getCaptureGroups(COLLECTION_REGEX, 1, 3)(location.pathname);
    console.log('collectionName', collectionName);
    if (collectionName == null && reqNotNull) throw new Error('useRoutedCollection called by no collection in scope');
    return [collectionName, id];
}
