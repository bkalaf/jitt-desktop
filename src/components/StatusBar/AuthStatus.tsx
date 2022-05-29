import { useAuth } from '../../hooks/useAuth';
import { StatusItem } from './StatusItem';

export function AuthStatus() {
    const { profileEmail } = useAuth();
    return <StatusItem className='text-white bg-blue'>{profileEmail}</StatusItem>;
}
