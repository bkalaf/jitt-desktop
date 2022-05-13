import React, { useEffect } from 'react';
import { useCallback, useState } from 'react';
import { Visibility } from '../types';
import { cycleVisibility } from '../util';
import { $cn } from '../util/$cn';
import { ModalAnchor } from './ModalAnchor';
import { Spinner } from './Spinner';

export function ModalContainer({ children }: { children?: Children }) {
    const [visibility, setVisibility] = useState<Visibility>('showing');
    const changeVisibility = useCallback(() => {
        setVisibility(cycleVisibility);
    }, []);
    const spread = $cn(
        { onAnimationEnd: changeVisibility },
        {
            hidden: visibility === 'hidden',
            flex: visibility !== 'hidden',
            slideInDown: visibility === 'showing',
            slideOutDown: visibility === 'hiding'
        },
        'absolute z-40 w-screen h-screen items-center justify-center pointer-events-none p-7'
    );

    return (
        <React.Suspense fallback={<Spinner />}>
            <ModalAnchor>
                <div {...spread}>
                    <section className='flex mx-auto my-auto text-white border-4 border-black border-double rounded-lg shadow-lg pointer-events-auto shadow-cyan bg-slate-very-dark/70'>
                        {children}
                    </section>
                </div>
            </ModalAnchor>
        </React.Suspense>
    );
}