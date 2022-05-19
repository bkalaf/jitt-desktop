import React from 'react';
import { Link } from 'react-router-dom';
import { toTitleCase } from '../../common';

export type IMainMenuItemProps = {
    to: string;
    label?: string;
};
export function MainMenuItem(props: IMainMenuItemProps) {
    const { to, label } = props;
    return (
        <li className='flex px-3 py-1.5 bg-amber text-white border-black border-2 border-double font-fira-sans font-bold text-2xl tracking-wider leading-loose shadow-lg hover:shadow-blue-dark focus:shadow-inner focus:shadow-white ring ring-transparent focus:ring-white mx-1.5 items-center justify-center'>
            <Link className='text-white uppercase font-fira-sans' to={to}>{label ?? toTitleCase(to)}</Link>
        </li>
    );
}
