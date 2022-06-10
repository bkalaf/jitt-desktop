import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLog } from './useLog';

export function useNavigateDown(state?: string) {
    const navigate = useNavigate();
    const location = useLocation();
    const log = useLog();
    return useCallback(() => {
        log(`location: ${JSON.stringify(location)}`);
        log(`location.pathname: ${location.pathname}`);
        log(`state: ${state}`);
        log(`navigating to: ${location.pathname.split('/').reverse().slice(1).reverse().join('/')}`);
        navigate([location.pathname.split('/').reverse().slice(1).reverse().join('/'), state].join(''));
    }, [location, log, navigate, state]);
}
