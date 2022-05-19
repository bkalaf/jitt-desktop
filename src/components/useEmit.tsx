import { useCallback } from 'react';
import EventEmitter from 'events';

export function useEmit(emitter: EventEmitter, eventName: string, args: string) {
    return useCallback(() => {
        emitter.emit(eventName, args);
    }, [args, emitter, eventName]);
}
