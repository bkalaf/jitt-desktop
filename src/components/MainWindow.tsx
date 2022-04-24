import { faHome, faWifi, faWifi1, faWifiSlash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';

export function useEventListener<TEvent extends Event>(name: string, listener: (ev: TEvent) => void, source: IEventPublisher) {
    const handler = useRef(listener);
    useEffect(() => {
        handler.current = listener;
    }, [listener]);
    useEffect(() => {
        source.addEventListener(name, handler.current);
        return () => source.removeEventListener(name, handler.current);
    });
}

export function MainWindow() {
    const location = useLocation();
    const [onLine, setOnLine] = useState(window.navigator.onLine);
    const markOnLine = useCallback(() => setOnLine(true), []);
    const markOffline = useCallback(() => setOnLine(false), []);
    useEventListener('online', markOnLine, window);
    useEventListener('offline', markOffline, window);
    return (
        <div className='flex flex-col w-full h-full py-0.5'>
            <TopBar />
            <div className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-black transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-indigo-dark font-fira-sans  mb-0.5'>
                <ul className='flex flex-row p-0.5 text-black bg-white border border-white rounded-xl'>
                    <li className='inline-flex' title='Go to your dashboard'>
                        <Link
                            className='inline-flex px-1 py-0.5 items-center justify-center font-fira-sans text-lg font-bold leading-loose tracking-wide text-white bg-black hover:bg-rose transition duration-1000 delay-200 ease-in-out outline outline-transparent ring border border-black rounded-lg ring-transparent focus:outline-amber-dark focus:ring-red transform hover:scale-105'
                            role='button'
                            to='/dash'>
                            <FontAwesomeIcon icon={faHome} size='lg' className='block font-bold' />
                        </Link>
                    </li>
                </ul>
            </div>
            <div className='flex w-full px-2 text-base font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-slate-very-dark font-fira-sans  mb-0.5 flex-row justify-between items-center'>
                <div className='flex bg-blue text-white font-fira-sans border border-white rounded-lg px-2 my-0.5 tracking-wider leading-loose font-bold duration-1000 ease-in-out delay-200'>
                    {location.pathname}
                </div>
            </div>

            <main className='flex flex-grow w-full px-2 text-white'>Main</main>
            <footer className='flex w-full px-2 text-base font-bold leading-loose tracking-wide text-white border border-white rounded-md bg-slate-very-dark'>
                <ul className='flex flex-row items-center justify-between w-full px-1 py-1'>
                    <li
                        className={`inline-flex my-0.5 mx-2 font-fira-sans text-base font-bold leading-loose tracking-wide text-black rounded-lg  shadow-black shadow p-1 ${
                            onLine ? 'bg-blue' : 'bg-red'
                        }`}
                        title={onLine ? 'on-line' : 'off-line'}>
                        {onLine && <FontAwesomeIcon icon={faWifi} size='lg' className='block text-xl font-extrabold text-black' />}
                        {!onLine && <FontAwesomeIcon icon={faWifiSlash} size='lg' className='block text-xl font-extrabold text-black' />}
                    </li>
                </ul>
            </footer>
        </div>
    );
}
