import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function useNavigateDown() {
    const navigate = useNavigate();
    return useCallback(() => navigate('./..'), [navigate]);
}
