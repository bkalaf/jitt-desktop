import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect } from 'react';
import { $cn } from './$cn';
import { useDeleteToast } from '../hooks/useDeleteToast';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faBanParking, faBug, faExclamationSquare, faThumbsUp, faTrafficCone } from '@fortawesome/pro-duotone-svg-icons';
import { ToastType } from './providers/ToasterProvider';
import { useToggle } from '../hooks/useToggle';
import { useToken } from '../hooks/useToken';
import { useVisibility } from '../hooks/useVisibility';
import { usePreventDefault } from '../hooks/usePreventDefault';

export const toastTypeMap: Record<ToastType, [IconDefinition, string, string, string, string]> = {
    info: [faExclamationSquare, 'bg-cyan-dark', 'bg-cyan', 'bg-cyan-light', 'INFO'],
    success: [faThumbsUp, 'bg-emerald-dark', 'bg-emerald', 'bg-emerald-light', 'SUCCESS'],
    failure: [faBanParking, 'bg-red-dark', 'bg-red', 'bg-red-light', 'FAILURE'],
    error: [faBug, 'bg-indigo-dark', 'bg-indigo', 'bg-indigo-light', 'ERROR'],
    warning: [faTrafficCone, 'bg-orange-dark', 'bg-orange', 'bg-orange-light', 'WARNING']
};
export type ToastProps = {
    title: string;
    subtitle?: string;
    body: string;
    icon: IconDefinition;
    bgDark: string;
    bg: string;
    id: string;
    bgLight: string;
};
export function Toast(props: ToastProps) {
    const { title, subtitle, body, icon, bg, bgDark, bgLight, id } = props;
    const deleteToast = useDeleteToast();
    const [visibility, changeVisibility] = useVisibility('showing');
    const [isLocked, toggleLock] = useToggle();
    const onAnimationEnd = useCallback(() => {
        if (visibility === 'hiding' || visibility === 'showing') {
            changeVisibility();
        }
    }, [changeVisibility, visibility]);
    const spread = $cn(
        { onAnimationEnd },
        {
            hidden: visibility === 'hidden',
            flex: visibility !== 'hidden',
            bounceInDown: visibility === 'showing',
            fadeOutRight: visibility === 'hiding'
        },
        'flex flex-row border border-black rounded-lg pointer-events-auto items-center justify-center duration-1000 delay-150 ease-in-out'
    );
    const [token, hasToken, setToken, clearToken] = useToken();
    useEffect(() => {
        if (isLocked) {
            clearToken();
        }
    }, [changeVisibility, clearToken, isLocked]);
    useEffect(() => {
        if (visibility === 'shown' && !isLocked) {
            if (hasToken()) {
                clearToken();
            }
            const cb = setTimeout(() => changeVisibility(), 12000);
            setToken(cb);
            return () => {
                clearTimeout(cb);
                clearToken();
            };
        }
        if (visibility === 'hiding' && hasToken()) {
            clearTimeout(token.current!);
            clearToken();
        }
        if (visibility === 'hidden') {
            deleteToast(id);
        }
    }, [changeVisibility, clearToken, deleteToast, hasToken, id, isLocked, setToken, token, visibility]);
    const prevent = usePreventDefault();
    return (
        <div role='button' {...spread} onClick={changeVisibility}>
            <div className={`${bg} flex items-center justify-center h-full text-black `}>
                <FontAwesomeIcon className='w-10 h-10' icon={icon} size='2x' />
            </div>
            <div className='flex flex-grow items-center justify-center flex-col p-0.5'>
                <span className={`flex ${bgDark} text-white font-fira-sans text-xl tracking-wide leading-loose justify-center  text-center font-bold w-full`}>
                    {title}
                </span>
                <span className={`flex ${bg} text-black font-fira-sans text-lg font-bold whitespace-pre text-center justify-center w-full`}>
                    {subtitle ?? ' '}
                </span>
                <p className={`flex ${bgLight} text-black text-base font-fira-sans font-normal text-left w-full justify-center `}>{body}</p>
                <div className={`flex w-full ${bgDark}`} onClick={prevent}>
                    <label className='flex text-base font-normal' htmlFor='lock'>
                        Lock this notification
                    </label>
                    <input className='flex' type='checkbox' name='lock' id='lock' checked={isLocked} onChange={toggleLock} />
                </div>
            </div>
        </div>
    );
}
