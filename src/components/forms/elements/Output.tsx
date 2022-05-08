import React, { OutputHTMLAttributes } from 'react';

export function Output(props: OutputHTMLAttributes<HTMLOutputElement>) {
    return <output {...props} />;
}
