import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { $currentUser, realmApp } from '../globals';

class Fake {
    static schema: Realm.ObjectSchema = { name: 'fake', primaryKey: '_id', properties: {} };
}
export function LoginForm() {
    const navigate = useNavigate();
    const [handleSubmit, register, formRef] = useForm<{ email: string; password: string }, Realm.User | null>(
        (fd) => ({ email: fd.get('email')?.toString() ?? '', password: fd.get('password')?.toString() ?? '' }),
        Fake
    );
    const submitter = (credentials: { email: string; password: string }) =>
        realmApp.logIn(Realm.Credentials.emailPassword(credentials.email, credentials.password));
    const successToast = useToast('success');
    const failureToast = useToast('failure');
    const onSubmit = React.useMemo(
        () =>
            handleSubmit(
                submitter,
                (user: Realm.User | null | undefined) => {
                    $currentUser(user);
                    navigate('/');
                    successToast('You have successfully logged in', 'SUCCESSFUL LOG-In', user?.profile.email);
                },
                (err?: Error) => failureToast(err?.message ?? 'Error logging in.', 'FAILED LOG-IN')
            ),
        [failureToast, handleSubmit, navigate, successToast]
    );

    return (
        <form className='grid grid-col-1' onSubmit={onSubmit} ref={formRef}>
            <div className='flex flex-col'>
                <label htmlFor='email' id='email-label' className='flex text-lg font-bold indent-3 font-fira-sans'>
                    E-mail
                </label>
                <input
                    type='email'
                    className='flex font-fira-sans text-base px-2 py-0.5 rounded-lg border border-black shadow-inner shadow-black bg-white'
                    {...register('email')}
                />
            </div>
            <div className='flex flex-col'>
                <label htmlFor='password' id='password-label' className='flex text-lg font-bold indent-3 font-fira-sans'>
                    Password
                </label>
                <input
                    type='password'
                    className='flex font-fira-sans text-base px-2 py-0.5 rounded-lg border border-black shadow-inner shadow-black bg-white'
                    {...register('password')}
                />
            </div>
            <input
                type='submit'
                className='flex border border-black bg-blue-dark py-0.5 px-2 rounded-lg shadow-inner shadow-black text-white text-lg font-bold font-fira-sans'
            />
        </form>
    );
}
