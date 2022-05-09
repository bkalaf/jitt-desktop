import { useCallback, useEffect, useMemo, useState } from 'react';
import { $cn } from '../components/$cn';
import { Visibility } from '../types/ui/Visibility';
import { isNotIn } from '../common/array/isNotIn';
import { cycleVisibility } from '../util/cycleVisibility';
import { useArray } from './useArray';

export function useProvideOverlay() {
    const { arr: contents, append: appendOverlay, pop: popOverlay } = useArray<JSX.Element>([]);
    const [visibility, setVisibility] = useState<Visibility>('hidden');
    const changeVisibility = useCallback(() => {
        setVisibility(cycleVisibility);
    }, []);

    const props = useMemo(
        () =>
            $cn(
                { onAnimationEnd: changeVisibility },
                {
                    hidden: visibility === 'hidden',
                    flex: visibility !== 'hidden',
                    slideInDown: visibility === 'showing',
                    slideOutDown: visibility === 'hiding'
                },
                'w-screen h-screen p-5 items-center justify-center pointer-events-none'
            ),
        [changeVisibility, visibility]
    );
    useEffect(() => {
        if (contents.length === 0 && isNotIn(['hiding', 'hidden'])(visibility)) {
            changeVisibility();
        }
        if (contents.length !== 0 && isNotIn(['showing', 'shown'])(visibility)) {
            changeVisibility();
        }
    }, [changeVisibility, contents.length, visibility]);
    return {
        contents,
        props,
        appendOverlay,
        popOverlay
    };
}
