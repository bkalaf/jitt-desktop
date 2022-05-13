import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import React from 'react';

export function IconLinkButton(props: { title: string; to: string; icon: IconDefinition }) {
    const { to, icon, title } = props;
    return (
        <li className='inline-flex' title={title}>
            <Link
                className='inline-flex items-center justify-center text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 transform bg-black rounded-md appearance-none font-fira-sans hover:bg-rose outline outline-transparent ring ring-transparent focus:outline-amber-dark focus:ring-red hover:scale-105'
                role='button'
                to={to}>
                <span className='px-2 py-1 border border-white rounded-md'>
                    <FontAwesomeIcon icon={icon} size='1x' className='block font-bold ' fixedWidth />
                </span>
            </Link>
        </li>
    );
}
