import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../hooks/useSearch';
import { StatusItem } from './StatusItem';

export function AuthStatus() {
    const { profileEmail } = useAuth();
    return <StatusItem className='text-white bg-blue'>{profileEmail}</StatusItem>;
}
