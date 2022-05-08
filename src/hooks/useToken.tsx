import { useCallback, useRef } from 'react';

export function useToken(): [
    token: React.RefObject<null | NodeJS.Timeout>,
    hasToken: () => boolean,
    setToken: (value: NodeJS.Timeout) => void,
    clearToken: () => void
] {
    const token = useRef<NodeJS.Timeout | null>(null);
    const setToken = useCallback((value: NodeJS.Timeout) => {
        token.current = value;
    }, []);
    const clearToken = useCallback(() => (token.current = null), []);
    const hasToken = useCallback(() => token.current != null, []);
    return [token, hasToken, setToken, clearToken];
}
