import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useUncontrolledForm } from '../../hooks/useForm';
import { useToast } from '../../hooks/useToast';
import { $currentUser, realmApp } from '../globals';
import { InputEle } from '../../data/definitions/index';
import { FormControl } from "../../data/definitions/FormControl";

class Fake {
    static schema: Realm.ObjectSchema = { name: 'fake', primaryKey: '_id', properties: {} };
}
export function LoginForm() {
    const navigate = useNavigate();
    const [handleSubmit, register, onInput] = useUncontrolledForm<{ email: string; password: string }>(x => x);
    const submitter = (credentials: { email: string; password: string }) =>
        realmApp.logIn(Realm.Credentials.emailPassword(credentials.email, credentials.password));
    const successToast = useToast('success');
    const failureToast = useToast('failure');
    const onSubmit = React.useMemo(
        () =>
            handleSubmit((x) => {
                submitter(x)
                    .then((y) => {
                        $currentUser(y);
                        navigate('/');
                        successToast('You have successfully logged in', 'SUCCESSFUL LOG-In', y?.profile.email);
                        return y;
                    })
                    .catch((x) => {
                        failureToast((x as Error).message, 'FAILED LOGIN', (x as Error).name);
                    });
                return undefined;
            }),
        [failureToast, handleSubmit, navigate, successToast]
    );

    return (
        <form className='grid grid-cols-1' onSubmit={onSubmit}>
            <div className='flex flex-col'>
                <label htmlFor='email' id='email-label' className='flex text-lg font-bold indent-3 font-fira-sans'>
                    E-mail
                </label>
                <input
                    type='email'
                    className='flex font-fira-sans text-base px-2 py-0.5 rounded-lg border border-black shadow-inner shadow-black bg-white'
                    {...register('email', { Field: FormControl, Control: InputEle })}
                />
            </div>
            <div className='flex flex-col'>
                <label htmlFor='password' id='password-label' className='flex text-lg font-bold indent-3 font-fira-sans'>
                    Password
                </label>
                <input
                    type='password'
                    className='flex font-fira-sans text-base px-2 py-0.5 rounded-lg border border-black shadow-inner shadow-black bg-white'
                    {...register('password', { Field: FormControl, Control: InputEle })}
                />
            </div>

            <input
                type='submit'
                className='flex border border-black bg-blue-dark py-0.5 px-2 rounded-lg shadow-inner shadow-black text-white text-lg font-bold font-fira-sans'
            />
        </form>
    );
}
