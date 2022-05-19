import { useReactiveVar } from '@apollo/client';
import React, { useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ButtonGroup } from '../ButtonGroup';
import { ButtonListItem } from '../Buttons/ButtonListItem';
import { $currentUser } from '../globals';
import { TopBarItems } from './TopBarItems';

export function AuthSegment() {
    const cu = useReactiveVar($currentUser);
    const logOutFunction = useCallback(() => {
        if (!cu) return Promise.resolve();
        cu.logOut();
        $currentUser(null);
    }, [cu]);
    const { isAuthenticated } = useAuth();
    return (
        <ButtonGroup>
            {!isAuthenticated && <TopBarItems.AuthButtons.Login />}
            {!isAuthenticated && <ButtonListItem ix={1}>Register</ButtonListItem>}
            {isAuthenticated && (
                <ButtonListItem ix={2} onClick={logOutFunction}>
                    Log-Out
                </ButtonListItem>
            )}
        </ButtonGroup>
    );
}
