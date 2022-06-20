import { faWifi, faWifiSlash } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useState } from 'react';
import { useEventListener } from '../../hooks/useEventListener';
import React from 'react';
import { $cn } from '../../util/$cn';
import { StatusItem } from './StatusItem';
import { useTextToSpeech } from './useTextToSpeech';

export function OnlineStatus() {
    const [onLine, setOnLine] = useState(window.navigator.onLine);
    const tts = useTextToSpeech();
    const markOnLine = useCallback(() => {
        tts('internet connection restored');
        setOnLine(true);
    }, [tts]);
    const markOffline = useCallback(() => {
        tts('internet connection has been lost');
        setOnLine(false);
    }, [tts]);
    useEventListener('online', markOnLine, window);
    useEventListener('offline', markOffline, window);
    const spread = $cn({}, { 'bg-blue': onLine, 'bg-red': !onLine });
    return (
        <StatusItem {...spread} title={onLine ? 'on-line' : 'off-line'}>
            {onLine && <FontAwesomeIcon icon={faWifi} size='lg' className='block text-xl font-extrabold text-black' />}
            {!onLine && <FontAwesomeIcon icon={faWifiSlash} size='lg' className='block text-xl font-extrabold text-black' />}
        </StatusItem>
    );
}
