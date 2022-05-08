import { useCallback } from 'react';
import { ignore } from '../common/ignore';

export function usePreventDefault<T extends React.SyntheticEvent<HTMLElement>>(action: (ev: T) => void = ignore) {
    return useCallback(
        (ev: T) => {
            ev.stopPropagation();
            action(ev);
        },
        [action]
    );
}
