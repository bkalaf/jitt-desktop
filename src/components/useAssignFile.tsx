import { ignore } from '../common';


export function useAssignFile(): [boolean, () => void] {
    return [true, ignore];
}
