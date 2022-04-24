import React from 'react';
import { Link } from 'react-router-dom';
import { RootMenu } from './RootMenu';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logo = require('./../assets/logos/resized-logo.png');

export const TopBarItems = {
    Menu: {
        RootItems: React.memo(RootMenu, () => true),
        Logo: React.memo(
            () => (
                <Link to='/' className='flex'>
                    <img src={logo} className='object-scale-down h-14'></img>
                </Link>
            ),
            () => true
        )
    }
};