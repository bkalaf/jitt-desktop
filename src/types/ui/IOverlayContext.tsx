import { HTMLAttributes } from 'react';

export type IOverlayContext = {
    contents: JSX.Element[];
    appendOverlay: (item: JSX.Element) => void;
    popOverlay: () => void;
    props: HTMLAttributes<HTMLElement>;
};
