import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useNavigateAndDrill() {
    const navigate = useNavigate();
    const location = useLocation();
    return useCallback((next: string) => navigate([location.pathname, next].join('/')), [location.pathname, navigate]);
}
