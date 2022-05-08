import { useParams } from 'react-router-dom';

export function useCollectionParam() {
    const { collection } = useParams();
    if (collection == null) throw new Error('no collection name');
    return collection;
}
