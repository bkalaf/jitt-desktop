import { useMemo } from 'react';
import React from 'react';

export function Definitions({ children }: { children: any }) {
    return (
        <>
            {useMemo(
                () => React.Children.toArray(children).map((x, ix) => React.cloneElement(x as JSX.Element, { ...(x as JSX.Element).props, key: ix })),
                [children]
            )}
        </>
    );
}
