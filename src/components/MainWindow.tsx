/* eslint-disable react/boolean-prop-naming */
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { LoginForm } from './forms/LoginForm';
import { Toaster } from './Toaster';
import { LeftSidebar } from './LeftSidebar';
import { MainRouter } from './MainRouter';
import { StatusBar } from './StatusBar';
import { LazyDataOrModifiedFn, useAsyncResource } from 'use-async-resource';
import * as fs from 'graceful-fs';
import { charRange } from '../common';
import { files } from '../config';
import { readFile } from '../common/fs/readFile';
import { writeFile } from '../common/fs/writeFile';
import { makeVar } from '@apollo/client';
import { ToolBar } from './ToolBar';
import { TopBar } from './TopBar';
import { ObjectId } from 'bson';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { DuotoneButton } from './providers/DuotoneBtn';
import { $cn } from '../util/$cn';
import { useLog } from '../hooks/useLog';
import { remote } from 'webdriverio';
import { useReactiveVar } from '@apollo/client';

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
export function ifExistsDelete(fn: string) {
    if (fs.existsSync(fn)) {
        return fs.rmSync(fn);
    }
}
export function ifNotExistCreate(fn: string) {
    if (!fs.existsSync(fn)) {
        return fs.writeFileSync(fn, '');
    }
}
export function joinText(str: string[]) {
    return str.join('');
}
export function startBrands(log: (...args: any[]) => void) {
    function purgeFiles() {
        ifExistsDelete(files.brands);
        ifExistsDelete(files.brandsDone);
        ifExistsDelete(files.brandsTodo);
        writeFile(files.brandsTodo)(sequences().map(joinText).join('\n'));
    }
    if (fs.existsSync(files.brandsDone)) {
        const total = characters.length * characters.length * characters.length;
        const dones = readFile(files.brandsDone).split('\n');
        const actual = dones.length;
        log(`EXPECTED TOTAL`, total, actual);
        if (total === actual) {
            purgeFiles();
        } else {
            ifExistsDelete(files.brandsTodo);
            fs.writeFileSync(
                files.brandsTodo,
                sequences()
                    .map(joinText)
                    .filter((x) => !dones.includes(x))
                    .join('\n')
            );
        }
    } else {
        purgeFiles();
    }
    const result = readFile(files.brandsTodo)
        .split('\n')
        .map((x) => x.split('')) as [string, string, string][];
    log('todo', result.length);
    return result;
}

export function writeBrands(entry: string, brands: string[]) {
    if (brands.length > 0) {
        fs.appendFileSync(files.brands, `${brands.join('\n')}\n`);
    }
    fs.appendFileSync(files.brandsDone, entry);
}

export function finishBrands(log: (...args: any[]) => void) {
    log(`output file: ${files.brands}`);
    const data = readFile(files.brands).split('\n');
    log('totalBrands', data.length);
    const uniqueBrands = new Set(data);
    log('uniqueBrands', uniqueBrands.size);
    const result = { uniqueBrands: Array.from(uniqueBrands.entries()) };
    fs.writeFileSync(files.brandListings, JSON.stringify(result));
    log('output written');
    localStorage.setItem('brandsLastFetched', new Date(Date.now()).toString());
}

const characters = [...charRange('a', 'z').map((x) => String.fromCharCode(x)), ...charRange('0', '9').map((x) => String.fromCharCode(x)), ' ', '-', "'"];

function processBrandsScrape() {
    const filename = 0;
}
function sequences() {
    const result: [string, string, string][] = [];
    for (let i1 = 0; i1 < characters.length; i1++) {
        const el1 = characters[i1];
        for (let i2 = 0; i2 < characters.length; i2++) {
            const el2 = characters[i2];
            for (let i3 = 0; i3 < characters.length; i3++) {
                const el3 = characters[i3];
                // for (let i4 = 0; i4 < characters.length; i4++) {
                //     const el4 = characters[i4];
                // }
                result.push([el1, el2, el3]);
            }
        }
    }
    return result;
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
export function MainWindow({ realmReader }: { realmReader: LazyDataOrModifiedFn<Realm> }) {
    useEffect(() => {
        const v = window.speechSynthesis.getVoices().filter((x) => x.lang === 'en-US')[65];
        if (v !== null) $voice(v);
        window.speechSynthesis.onvoiceschanged = function () {
            console.log('ON VOICES CHANGES');
            console.log('voices.length', window.speechSynthesis.getVoices().length);
            const v2 = window.speechSynthesis.getVoices().filter((x) => x.lang === 'en-US')[65];
            $voice(v2);
        };
    }, []);
    const voice = useReactiveVar($voice);
    const realm = realmReader();
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
    const log = useLog();

    useEffect(() => {
        if (realm) {
            // realm.write(() => {
            //     realm.create('productTemplate', { _id: new ObjectId(), dims: { weight: { uom: 'oz', value: 1.0 } } });
            // });
            const result = realm.objects('productTemplate');
            result.forEach((x: any) => {
                log(JSON.stringify(x));
                console.log(x);
                const x2 = x.dims;
                const x3 = Object.getOwnPropertyNames(x.dims);
                const d: Record<string, IDimension<any>> = {};
                x3.forEach((name) => (d[name] = x.dims[name]));
                console.log(x.dims);
                console.log(x2);
                console.log(x3);
                log(d);
                console.log(d);
            });
        }
    }, [log, realm]);
    useEffect(() => {
        speak(voice);
    }, [voice]);
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
                <div className='flex bg-blue text-white font-fira-sans border border-white rounded-lg px-2 my-0.5 tracking-wider leading-loose font-bold duration-1000 ease-in-out delay-200'>
                    {location.pathname}
                </div>
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
