import { useEffect, useRef } from 'react';
import { IEventOnPublisher } from './useEventListener';

export function useOnEvent<TArgs extends any[]>(name: string, listener: (...args: TArgs) => void, source: IEventOnPublisher<TArgs>) {
    const handler = useRef(listener);
    useEffect(() => {
        handler.current = listener;
    }, [listener]);
    useEffect(() => {
        source.on(name, listener);
        return () => {
            source.off(name, listener);
        };
    }, [listener, name, source]);
}
