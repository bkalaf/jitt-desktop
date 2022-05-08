/* eslint-disable react/boolean-prop-naming */
import { faArrowAltLeft, faArrowLeft, faHome, faPlusCircle, faTrashAlt, faWifi1, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { makeVar } from '@apollo/client';
import { Button } from './Button';
import { stringify } from 'querystring';
import React from 'react';
import { LoginForm } from './forms/LoginForm';
import { OnlineStatus } from './StatusBar/OnlineStatus';
import { ignore } from '../common/ignore';
import { Toaster } from './Toaster';
import { LeftSidebar } from './LeftSidebar';
import { useInsertCommand } from '../hooks/useInsertCommand';
import { useDeleteCommand } from '../hooks/useDeleteCommand';
import { IconLinkButton } from './IconLinkButton';
import { useToast } from '../hooks/useToast';
import { AuthStatus } from './StatusBar/AuthStatus';
import { $deleteCommand, $insertCommand } from './App';
import { MainRouter } from './MainRouter';
import { useDAL } from './grid/useDAL';
import { useRealm } from '../hooks/useRealm';
import { $cn } from './$cn';
import { CommandButton } from './CommandButton';
import { useSchema } from './useSchema';

export type IconButtonProps = {
    title: string;
    icon: IconDefinition;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    overrideDisabled?: boolean;
};
export function IconButton(props: IconButtonProps) {
    const { overrideDisabled, ...remain } = props;
    const { icon, onClick, title, disabled, className } = $cn(
        remain,
        {
            'disabled:opacity-50': !overrideDisabled,
            'disabled:bg-neutral-dark': !overrideDisabled,
            'hover:disabled:bg-black': overrideDisabled ?? false,
            'hover:disabled:scale-100': overrideDisabled ?? false
        },
        'inline-flex items-center justify-center text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 transform bg-black rounded-md appearance-none font-fira-sans hover:bg-rose outline outline-transparent ring ring-transparent focus:outline-amber-dark focus:ring-red hover:scale-105 border-blue'
    );
    return (
        <li className='inline-flex' title={title}>
            <button disabled={disabled ?? false} type='button' className={className} onClick={onClick} tabIndex={disabled ? -1 : undefined}>
                <span className='px-2 py-1 border border-white rounded-md'>
                    <FontAwesomeIcon icon={icon} size='1x' className='block font-bold' fixedWidth />
                </span>
            </button>
        </li>
    );
}

export function MainWindow() {
    const realm = useRealm();
    const schema = useSchema();
    const location = useLocation();
    const navigate = useNavigate();
    const goBack = useCallback(() => navigate(-1), [navigate]);
    const infoToast = useToast('info');

    const { disabled: insertDisabled, execute: insertExecute } = useInsertCommand();
    const { disabled: deleteDisabled, execute: deleteExecute } = useDeleteCommand();
    useDAL('self-storage');
    useDAL('facility');
    useEffect(() => {
        if (realm) {
            console.log('new realm', realm);
            console.log(schema.types);
            console.log(schema.getType('self-storage'));
            console.log(schema.getColumns('self-storage'));
            console.log(schema.getColumns('facility'));
            console.log(schema.getColumns('rental-unit'));
            console.log(schema.getControls('facility'));
            console.log(schema.getControls('self-storage'));
            console.log(schema.getControls('rental-unit'));
        }
    }, [realm, schema]);

    return (
        <div className='relative flex flex-col w-full h-full py-0.5'>
            <TopBar />
            <div className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-black transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-indigo-dark font-fira-sans mb-0.5 justify-center'>
                <ul className='flex flex-row justify-center p-1 space-x-1 text-black border border-white rounded-lg bg-slate-dark'>
                    <IconLinkButton to='/dashboard' title='Go to your dashboard.' icon={faHome} />
                    <IconButton icon={faArrowLeft} title='Go back 1 page.' onClick={goBack} />
                    <CommandButton icon={faPlusCircle} title='Insert a new record.' rVar={$insertCommand} />
                    <CommandButton icon={faTrashAlt} title='Delete selected records.' rVar={$deleteCommand} />
                </ul>
            </div>
            <div className='flex w-full px-2 text-base font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-slate-very-dark font-fira-sans  mb-0.5 flex-row justify-between items-center'>
                <div className='flex bg-blue text-white font-fira-sans border border-white rounded-lg px-2 my-0.5 tracking-wider leading-loose font-bold duration-1000 ease-in-out delay-200'>
                    {location.pathname}
                </div>
            </div>

            <main className='flex flex-grow w-full px-2 text-white'>
                <LeftSidebar />
                <section className='flex overflow-x-auto'>
                    <MainRouter />
                </section>
            </main>
            <footer className='flex w-full px-2 text-base font-bold text-white border border-white rounded-md bg-slate-very-dark'>
                <ul className='flex flex-row items-center justify-between w-full px-1 py-0.5'>
                    <OnlineStatus />
                    <AuthStatus />
                </ul>
            </footer>
            <Toaster />
        </div>
    );
}

export function LoginPage() {
    return <LoginForm></LoginForm>;
}
