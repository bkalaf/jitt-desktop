import React, { useEffect } from 'react';
import { useCallback, useState } from 'react';
import { Visibility } from '../types';
import { cycleVisibility } from '../util';
import { $cn } from '../util/$cn';
import { ModalAnchor } from './ModalAnchor';
import { Spinner } from './Indicators/Spinner';

export function ModalContainer({ children }: { children?: Children }) {
    const [visibility, setVisibility] = useState<Visibility>('showing');
    const changeVisibility = useCallback(() => {
        setVisibility(cycleVisibility);
    }, []);
    const spread = $cn(
        { onAnimationEnd: changeVisibility },
        {
            hidden: visibility === 'hidden',
            'hidden only:flex last:flex': visibility !== 'hidden',
            'hidden only:slideInDown last:slideInDown': visibility === 'showing',
            'hidden only:slideOutDown last:slideOutDown': visibility === 'hiding'
        },
        'absolute z-40 w-screen h-screen items-center justify-center pointer-events-none p-7'
    );

    return (
        <React.Suspense fallback={<Spinner />}>
            <ModalAnchor>
                <div {...spread}>
                    <section className='flex items-center justify-center w-4/5 p-4 text-white border-4 border-black border-double rounded-lg shadow-xl pointer-events-auto h-2/3 shadow-red bg-slate-very-dark/70'>
                        {children}
                    </section>
                </div>
            </ModalAnchor>
        </React.Suspense>
    );
}
