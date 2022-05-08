import { useLocation } from 'react-router-dom';

export function useRoutedCollection() {
    const location = useLocation();
    const collectionName = location.pathname.split('/').reverse()[0];
    console.log('collectionName', collectionName);
    if (collectionName == null) throw new Error('useRoutedCollection called by no collection in scope');
    return collectionName;
}
