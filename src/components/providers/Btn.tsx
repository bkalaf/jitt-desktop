/* eslint-disable react/boolean-prop-naming */
import { useCallback, useRef, useState } from 'react';
import { useWhyDidYou } from '../../hooks/useWhyDidYou';
import { $cn } from '../../util/$cn';

export type IBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { toEnable?: (ref: React.RefObject<HTMLButtonElement>) => boolean; initState?: boolean };

export function Btn(props: IBtnProps) {
    useWhyDidYou(Btn.name, props);

    const [disabled, setDisabled] = useState(false);
    const [animating, setAnimating] = useState(false);
    const markEnabled = useCallback(() => {
        setDisabled((prev) => {
            if (prev === true) setAnimating(true);
            return false;
        });
    }, []);
    const markDisabled = useCallback(() => {
        setDisabled((prev) => {
            if (prev === false) setAnimating(true);
            return true;
        });
    }, []);
    const onMouseOver = useCallback(
        (ev: React.MouseEvent<HTMLElement>) => {
            console.log('onMouseEnter');
            markEnabled();
        },
        [markEnabled]
    );
    const onMouseLeave = useCallback(
        (ev: React.MouseEvent<HTMLElement>) => {
            console.log('onMouseLeave');
            markDisabled();
        },
        [markDisabled]
    );
    const onFocus = useCallback(
        (ev: React.FocusEvent<HTMLElement>) => {
            console.log('onFocus');
            markEnabled();
        },
        [markEnabled]
    );
    const onBlur = useCallback(
        (ev: React.FocusEvent<HTMLElement>) => {
            console.log('onBlur');
            markDisabled();
        },
        [markDisabled]
    );
    const onAnimationEnd = useCallback(() => {
        setAnimating(false);
    }, []);
    const ref = useRef<HTMLButtonElement | null>(null);
    const { children, toEnable, initState, ...spread } = $cn(
        props,
        { heartBeat: animating },
        'transform transition-all duration-1000 delay-150 ease-in-out flex items-center justify-center px-2 py-0.5 align-middle text-center bg-amber-light border rounded-md border-cyan/70 shadow-lg shadow-sky m-auto w-auto disabled:opacity-30 disabled:hover:opacity-30 disabled:focus:opacity-30 focus:ring focus:ring-red/70 hover:ring hover:ring-red/70'
    );
    const actualDisable = disabled === true ? true : (toEnable != null ? toEnable(ref) : false);
    return (
        <button
            ref={ref}
            type='button'
            {...spread}
            onAnimationEnd={onAnimationEnd}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={actualDisable}>
            {children}
        </button>
    );
}
