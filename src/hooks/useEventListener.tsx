import { useEffect, useRef } from 'react';

export function useEventListener<TEvent extends Event>(name: string, listener: (ev: TEvent) => void, source: IEventPublisher) {
    const handler = useRef(listener);
    useEffect(() => {
        handler.current = listener;
    }, [listener]);
    useEffect(() => {
        source.addEventListener(name, handler.current);
        return () => source.removeEventListener(name, handler.current);
    });
}
