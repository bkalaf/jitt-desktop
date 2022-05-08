import { cloneElement, useEffect, useMemo } from 'react';
import { useOverlay } from './providers/OverlayProvider';
import React from 'react';
import { Spinner } from './Spinner';
import { useParams } from 'react-router-dom';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { Overlay } from './Overlay';

export function Modal(props: { children: JSX.Element }) {
    useWhyDidYou('Modal', props);
    const { children } = props;
    const { appendOverlay, popOverlay } = useOverlay();
    const params = useParams();

    useEffect(() => {
        appendOverlay(children);
        return () => popOverlay();
    }, [appendOverlay, children, popOverlay]);
    return <Spinner />;
}
