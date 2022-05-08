import { useCallback, useState } from 'react';

export function useToggle(init = false): [state: boolean, toggle: () => void, on: () => void, off: () => void] {
    const [state, setState] = useState(init);
    const toggler = useCallback(() => {
        setState((prev) => !prev);
    }, []);
    const setOn = useCallback(() => setState(true), []);
    const setOff = useCallback(() => setState(false), []);
    return [state, toggler, setOn, setOff];
}
