import { useCallback, useState } from 'react';
import { cycleVisibility } from '../util/cycleVisibility';
import { Visibility } from '../types/ui/Visibility';

export function useVisibility(init: Visibility = 'hidden'): [Visibility, () => void] {
    const [state, setState] = useState<Visibility>(init);
    const changeState = useCallback(() => {
        setState((prev) => {
            const next = cycleVisibility(prev);
            console.log(`visibility changed: ${next}`);
            return next;
        });
    }, []);
    return [state, changeState];
}
