/* eslint-disable react/boolean-prop-naming */
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoginForm } from './forms/LoginForm';
import { Toaster, useMetaDataContext } from './Toaster';
import { LeftSidebar } from './LeftSidebar';
import { MainRouter } from './MainRouter';
import { useRealm } from '../hooks/useRealm';
import { $cn } from '../util/$cn';
import { StatusBar } from './StatusBar';
import { createWebdriver } from './providers/createWebdriver';
import { DataOrModifiedFn, LazyDataOrModifiedFn, useAsyncResource } from 'use-async-resource';
import * as fs from 'graceful-fs';
import { charRange } from '../common';
import { files } from '../config';
import { readFile } from '../common/fs/readFile';
import { writeFile } from '../common/fs/writeFile';
import { makeVar } from '@apollo/client';
import { ToolBar } from './ToolBar';
import { TopBar } from './TopBar';

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
            'hover:disabledresult4.map(async x => await Promise.all(x)):scale-100': overrideDisabled ?? false
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

export function MainWindow({ realmReader }: { realmReader: LazyDataOrModifiedFn<Realm> }) {
    const realm = realmReader();
    const location = useLocation();
    const [reader, updateReader] = useAsyncResource<any>(async () => {
        console.log('output');
    }, []);
    return (
        <div className='relative flex flex-col w-full h-full py-0.5'>
            <TopBar />
            {/* <CategoryScraper reader={reader} /> */}
            <ToolBar />
            <div className='flex w-full px-2 text-base font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-slate-very-dark font-fira-sans  mb-0.5 flex-row justify-between items-center'>
                <div className='flex bg-blue text-white font-fira-sans border border-white rounded-lg px-2 my-0.5 tracking-wider leading-loose font-bold duration-1000 ease-in-out delay-200'>
                    {location.pathname}
                </div>
            </div>

            <main className='flex flex-grow w-full px-2 text-white'>
                <LeftSidebar />
                <section className='flex w-full h-full p-0.5 overflow-auto border-2 border-double shadow-inner border-cyan rounded-xl mx-1 my-0.5 shadow-cyan'>
                    <MainRouter reader={reader} />
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
