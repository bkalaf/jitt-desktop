import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spinner } from '../Spinner';

export function Boundary({ children }: { children: Children }) {
    return (
        <React.Suspense fallback={<Spinner />}>
            <ErrorBoundary
                fallbackRender={({ error }) => (
                    <div>
                        <div>Error happened.</div>
                        <div>{error.message}</div>
                    </div>
                )}>
                {children}
            </ErrorBoundary>
        </React.Suspense>
    );
}
