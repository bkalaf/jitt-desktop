import { useReactiveVar } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { $currentUser } from '../components/globals';

export function useAuth() {
    const currentUser = useReactiveVar($currentUser);
    const isAuthenticated = useMemo(() => currentUser != null, [currentUser]);
    const profileEmail = useMemo(() => currentUser?.profile?.email, [currentUser?.profile?.email]);
    const accessToken = useMemo(() => currentUser?.accessToken, [currentUser?.accessToken]);
    return {
        isAuthenticated,
        profileEmail,
        accessToken
    };
}
