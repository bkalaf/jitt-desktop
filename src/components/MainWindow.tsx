/* eslint-disable react/boolean-prop-naming */
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from './forms/LoginForm';
import { Toaster } from './Toaster';
import { LeftSidebar } from './LeftSidebar';
import { MainRouter } from './MainRouter';
import { StatusBar } from './StatusBar';
import { LazyDataOrModifiedFn, useAsyncResource } from 'use-async-resource';
import { charRange } from '../common';
import { makeVar } from '@apollo/client';
import { ToolBar } from './ToolBar';
import { TopBar } from './TopBar';
import { ObjectId } from 'bson';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { DuotoneButton } from './providers/DuotoneBtn';
import { $cn } from '../util/$cn';
import { remote } from 'webdriverio';
import { topBar } from '../menus/index';
import * as electron from 'electron/renderer';
import { Menu, MenuItem } from '@electron/remote';
import { ipcRenderer } from 'electron';
import { schema } from '../data';

// import { ipcRenderer, Menu } from 'electron';

export type IconButtonProps = {
    title: string;
    icon: IconDefinition;
    size?: SizeProp;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    overrideDisabled?: boolean;
};

export function ToolbarDuotoneButton(props: IconButtonProps & { primary: string; secondary: string; primaryOpacity?: number; secondaryOpacity?: number }) {
    const { overrideDisabled, ...remain } = props;
    const { icon, onClick, title, size, disabled, className, primary, secondary, primaryOpacity, secondaryOpacity } = $cn(
        remain,
        {
            'disabled:opacity-50': !overrideDisabled,
            'disabled:bg-neutral-dark': !overrideDisabled,
            'hover:disabled:bg-black': overrideDisabled ?? false,
            'hover:disabled:scale-100': overrideDisabled ?? false
        },
        'object-fill block bg-transparent'
    );
    return (
        <li className='inline-flex w-full h-full' title={title}>
            <DuotoneButton
                icon={icon}
                size={size}
                disabled={disabled}
                onClick={onClick}
                className={className}
                primary={primary}
                secondary={secondary}
                primaryOpacity={primaryOpacity}
                secondaryOpacity={secondaryOpacity}
            />
        </li>
    );
}

export const characters = [...charRange('a', 'z').map((x) => String.fromCharCode(x)), ...charRange('0', '9').map((x) => String.fromCharCode(x)), ' ', '-', "'"];

function processBrandsScrape() {
    const filename = 0;
}
const dataAttribute = ([dataname, value]: [string, string]) => `[data-${dataname}="${value}"]`;
const idAttribute = (id: string) => `#${id}`;
export const $selector = {
    data: dataAttribute,
    id: idAttribute
};

export const $showFileTools = makeVar<boolean>(false);

export const $voice = makeVar<SpeechSynthesisVoice | undefined>(undefined);
export function speak(voice: SpeechSynthesisVoice | undefined) {
    if (voice == null) return;
    const speechSynth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance('JITT has been loaded.');
    utterance.voice = voice;
    utterance.rate = 1;
    utterance.volume = 1;
    console.log(utterance);
    speechSynth.speak(utterance);
}
export async function tryUtter() {
    const browser = await remote({
        capabilities: {
            browserName: 'chrome'
        }
    });
    await browser.execute(`const speechSynth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance('JITT has been loaded.');
    const voices = speechSynth.getVoices();
    voices.forEach((voice) => {
        console.log(voice);
    });
    utterance.voice = speechSynth.getVoices()[0];
    utterance.rate = 1;
    utterance.volume = 1;
    speechSynth.speak(utterance);`);
}

export function sleep(timeInMs = 500) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), timeInMs));
}
export const $textToSpeech = function (utterance: string) {
    window.speechSynthesis.addEventListener('voiceschanged', function (ev: Event) {
        const v2 = window.speechSynthesis.getVoices().filter((x) => x.lang === 'en-US')[45];
        $voice(v2);
    });
    return new Promise<void>((resolve, reject) => {
        let voice = window.speechSynthesis.getVoices().find((x, ix) => x.lang === 'en-US' && ix === 65);
        const utter = new window.SpeechSynthesisUtterance(utterance);
        utter.volume = 1;
        utter.pitch = 1;
        utter.rate = 1;
        let count = 0;

        while (voice == null) {
            count++;
            if (count > 21) break;
            sleep(500).then(() => {
                voice = window.speechSynthesis.getVoices().find((x, ix) => x.lang === 'en-US' && ix === 45);
            });
        }
        utter.voice = voice!;
        window.speechSynthesis.speak(utter);
        return resolve();
    });
};

export function onNavigateTo(navigate: ReturnType<typeof useNavigate>) {
    return (ev: electron.IpcRendererEvent, to: string) => {
        navigate(to);
    };
}

export function MainWindow({ realmReader }: { realmReader: LazyDataOrModifiedFn<Realm> }) {
    const navigate = useNavigate();
    const onNavigateEvent = useMemo(() => onNavigateTo(navigate), [navigate]);
    useEffect(() => {
        ipcRenderer.on('navigate-to', onNavigateEvent);
        return () => {
            ipcRenderer.off('navigate-to', onNavigateEvent);
        };
    }, [onNavigateEvent]);
    // useEffect(() => {
    //     const v = window.speechSynthesis.getVoices().filter((x) => x.lang === 'en-US')[65];
    //     if (v !== null) $voice(v);
    //     window.speechSynthesis.onvoiceschanged = function () {
    //         console.log('ON VOICES CHANGES');
    //         console.log('voices.length', window.speechSynthesis.getVoices().length);

    //     };
    // }, []);
    const realm = realmReader();
    // useEffect(() => {
    //     realm?._updateSchema(schema.map(x => x.schema));
    // }, [realm]);
    // const insertType = useCallback(
    //     (kind: TypeKind, name: string, embedded: boolean, columns: string[], headers: string[], ...fields: any[]) => {
    //         if (realm == null) throw new Error('oops');
    //         const result = realm.objects('type-data').filtered('kind == $0 AND name == $1', kind, name);

    //         if ((result?.length ?? 0) === 0) {
    //             realm.write(() => {
    //                 realm.create('type-data', {
    //                     _id: new ObjectId(),
    //                     kind,
    //                     name,
    //                     embedded,
    //                     fields: [{ name: ['_id'], datatype: 'objectId', displayName: 'ID', required: true, readOnly: true, icon: faKey }, ...fields],
    //                     headerProps: {
    //                         columns: JSON.stringify(columns),
    //                         headers: JSON.stringify(headers)
    //                     },
    //                     rowProps: { columns: JSON.stringify(columns) }
    //                 });
    //             });
    //         }
    //     },
    //     [realm]
    // );
    // useEffect(() => {
    //     insertType(
    //         'complex-type',
    //         'address',
    //         true,
    //         ['street', 'suite', 'city', 'state', 'country', 'postalCode'],
    //         ['Street', 'Suite', 'City', 'State', 'Country', 'Postal Code'],
    //         {
    //             name: ['street'],
    //             type: 'text',
    //             Control: Input,
    //             datatype: 'string',
    //             displayName: 'Street'
    //         },
    //         { name: ['suite'], type: 'text', Control: Input, datatype: 'string', displayName: 'Suite' },
    //         { name: ['city'], type: 'text', required: true, Control: Input, datatype: 'string', displayName: 'City' },
    //         { name: ['state'], Control: Select, enumMap: provinces, datatype: 'string', displayName: 'State / Province' },
    //         { name: ['country'], Control: Select, enumMap: countries, datatype: 'string', displayName: 'Country' },
    //         {
    //             name: ['postalCode'],
    //             pattern: /^([0-9]{5}(-?[0-9]{4})?$)|(^[A-Z][0-9][A-Z]-?[0-9][A-Z][0-9]$)/.toString(),
    //             datatype: 'string',
    //             displayName: 'Postal Code'
    //         }
    //     );
    // }, [insertType, realm]);
    const location = useLocation();
    const [reader, updateReader] = useAsyncResource<any>(async () => {
        console.log('output');
    }, []);

    useEffect(() => {
        console.log('attempting text-to-speech');
        $textToSpeech('JITT loaded.')
            .catch((e) => $textToSpeech('JITT Loaded'))
            .finally(() => console.log('UTTERED'));
    }, []);
    useEffect(() => {
        const handler = function (ev: electron.IpcRendererEvent, to: string) {
            navigate(to);
        };
        electron.ipcRenderer.on('request-navigate', handler);
        return () => {
            electron.ipcRenderer.off('request-navigate', handler);
        };
    }, [navigate]);
    return (
        <div className='relative flex flex-col w-full h-full py-0.5'>
            {useMemo(
                () => (
                    <datalist id='verified-brand-list'>
                        <option key='' value='' label='Choose...'></option>
                        {realm
                            ?.objects<{ _id: ObjectId; name: string }>('verified-brand')
                            .sorted([['name', false]])
                            .map((x) => (
                                <option key={x._id.toHexString()} value={x._id.toHexString()} label={x.name} />
                            ))}
                    </datalist>
                ),
                [realm]
            )}
            {useMemo(
                () => (
                    <datalist id='taxonomy-list'>
                        <option key='' value='' label='Choose...'></option>
                        {realm
                            ?.objects<{ _id: ObjectId; materializedPath: string }>('taxonomy')
                            .sorted([['materializedPath', false]])
                            .map((x) => (
                                <option key={x._id.toHexString()} value={x._id.toHexString()} label={x.materializedPath} />
                            ))}
                    </datalist>
                ),
                [realm]
            )}
            <TopBar />
            {/* <CategoryScraper reader={reader} /> */}
            <ToolBar />
            <div className='flex w-full px-2 text-base font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-slate-very-dark font-fira-sans  mb-0.5 flex-row justify-between items-center'>
                <div className='flex bg-blue text-white font-fira-sans border border-white rounded-lg px-2 my-0.5 tracking-wider leading-loose font-bold duration-1000 ease-in-out delay-200'>{location.pathname}</div>
            </div>

            <main className='flex flex-grow w-full px-2 overflow-scroll text-white'>
                <LeftSidebar />
                <section className='flex w-full h-full p-0.5 border-2 border-double shadow-inner border-cyan rounded-xl mx-1 my-0.5 shadow-cyan'>
                    <MainRouter realm={realm!} reader={reader} />
                </section>
            </main>
            <StatusBar />
            <Toaster />
        </div>
    );
}

export function LoginPage() {
    return <LoginForm></LoginForm>;
}
