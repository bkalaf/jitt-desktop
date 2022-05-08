import { useParams } from 'react-router-dom';

export function useIDParam() {
    const { id } = useParams();
    if (id == null) throw new Error('no id param');
    return id;
}
