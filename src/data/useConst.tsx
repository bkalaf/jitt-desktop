import { useCallback } from 'react';


export function useConst(value: boolean) {
    return useCallback(() => value, []);
}
