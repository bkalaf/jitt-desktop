import { useReactiveVar } from '@apollo/client';
import { $deleteCommand } from '../components/App';

export function useDeleteCommand() {
    return useReactiveVar($deleteCommand);
}
