import { useReactiveVar } from '@apollo/client';
import { $insertCommand } from '../components/App';

export function useInsertCommand() {
    return useReactiveVar($insertCommand);
}
