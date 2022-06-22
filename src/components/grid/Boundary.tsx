import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Spinner } from '../Indicators/Spinner';

export function Boundary({ children }: { children: Children }) {
    return (
        <React.Suspense fallback={<Spinner />}>
            <ErrorBoundary
                fallbackRender={({ error }) => {
                    return (
                        <div className='text-white'>
                            <div className='text-white'>Error happened.</div>
                            <div className='text-white whitespace-pre'>{error.message}</div>
                        </div>
                    );
                }}>
                {children}
            </ErrorBoundary>
        </React.Suspense>
    );
}
