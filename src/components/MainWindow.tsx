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
import { Toaster, useMetaDataContext } from './Toaster';
import { LeftSidebar } from './LeftSidebar';
import { useInsertCommand } from '../hooks/useInsertCommand';
import { useDeleteCommand } from '../hooks/useDeleteCommand';
import { IconLinkButton } from './Buttons/IconLinkButton';
import { useToast } from '../hooks/useToast';
import { AuthStatus } from './StatusBar/AuthStatus';
import { $deleteCommand, $insertCommand } from './App';
import { MainRouter } from './MainRouter';
import { useDAL } from '../hooks/useDAL';
import { useRealm } from '../hooks/useRealm';
import { $cn } from '../util/$cn';
import { CommandButton } from './Buttons/CommandButton';
import { useSchema } from '../hooks/useSchema';
import { QueryParams } from './StatusBar/QueryParams';
import { StatusBar } from './StatusBar';
import { createWebdriver } from './providers/WebdriverProvider';
import * as Webdriver from 'webdriverio';
import { DataOrModifiedFn, useAsyncResource } from 'use-async-resource';
import { process } from '@electron/remote';
import * as fs from 'graceful-fs';
import { charRange, distinct, rangeBetween } from '../common';
import { webdriver } from '../config/webdriver';
import { APP_CONFIG, files } from '../config';
import { useLog } from './providers/buildLibrary';
import path from 'path';

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
export function readFile(filename: string) {
    return fs.readFileSync(filename).toString();
}
export function joinText(str: string[]) {
    return str.join('');
}
export function checkDirectory(folder: string) {
    if (fs.existsSync(folder)) return;
    const next = folder.split(path.sep).reverse().slice(1).reverse().join(path.sep);
    console.log(`next`, next);
    checkDirectory(next);
    fs.mkdirSync(folder);
}

function writeFile(filename: string) {
    return (value: string) => {
        const folder = path.dirname(filename);
        checkDirectory(folder);
        fs.writeFileSync(filename, value);
    };
}
function startBrands(log: (...args: any[]) => void) {
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

function writeBrands(entry: string, brands: string[]) {
    if (brands.length > 0) {
        fs.appendFileSync(files.brands, `${brands.join('\n')}\n`);
    }
    fs.appendFileSync(files.brandsDone, entry);
}

function finishBrands(log: (...args: any[]) => void) {
    const data = readFile(files.brands).split('\n');
    log('totalBrands', data.length);
    const uniqueBrands = distinct(data);
    log('uniqueBrands', uniqueBrands.length);
    const result = { uniqueBrands };
    fs.writeFileSync(files.brandListings, JSON.stringify(result));
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

export function click(browser: Webdriver.Browser<'async'>) {
    return async function (selector: [string, string]) {
        const el = await browser.$($selector.data(selector));
        await el.waitForClickable({ timeout: 20000 });
        await el.click();
    };
}
export function getValue(browser: Webdriver.Browser<'async'>) {
    return async function (selector: [string, string]) {
        const el = await browser.$($selector.data(selector));
        await el.waitForEnabled({ timeout: 20000 });
        return await el.getValue();
    };
}
export function setValue(browser: Webdriver.Browser<'async'>) {
    return async function (selector: [string, string], value: string) {
        const el = await browser.$($selector.data(selector));
        await el.waitForEnabled({ timeout: 20000 });
        await el.setValue(value);
        await browser.waitUntil(async () => {
            return (await getValue(browser)(selector)) === value;
        });
    };
}
export async function MercariLogIn(browser: Webdriver.Browser<'async'>) {
    await browser.url(webdriver.urls.mercari);
    await click(browser)(webdriver.selectors.logInButton);
    await setValue(browser)(webdriver.selectors.emailInput, APP_CONFIG.credentials.mercari.username);
    await setValue(browser)(webdriver.selectors.passwordInput, APP_CONFIG.credentials.mercari.password);
    await click(browser)(webdriver.selectors.logInSubmitButton);
    await click(browser)(webdriver.selectors.CTA);
}

const dataAttribute = ([dataname, value]: [string, string]) => `[data-${dataname}="${value}"]`;
export const $selector = {
    data: dataAttribute
};

export function CategoryScraper({ reader }: { reader: DataOrModifiedFn<Webdriver.Browser<'async'>> }) {
    const browser = reader();
    const log = useLog();
    useEffect(() => {}, []);
    return <></>;
}

export function Test({ reader }: { reader: DataOrModifiedFn<Webdriver.Browser<'async'>> }) {
    const browser = reader();
    const log = useLog();
    useEffect(() => {
        async function run() {
            async function inner([x1, x2, x3]: [string, string, string]) {
                // await browser.$('[data-testid="Brand"]').waitForEnabled({
                //     timeout: 5000
                // });
                await browser.$('[data-testid="Brand"]').clearValue();
                await browser.$('[data-testid="Brand"]').click();
                await browser.keys([x1]);
                await browser.keys([x2]);
                await browser.keys([x3]);
                // await browser.keys([x4]);
                await browser.pause(500);
                const result = await browser.$('[data-testid="BrandDropdown"]');
                const result1 = await result.$$('div > span');
                const result2 = result1.map(async (x) => await x.$$('span > span'));
                const result3 = await Promise.all(result2);
                const result4 = await Promise.all(result3.map(async (x) => await Promise.all(x.map(async (y) => await y.getText()))));
                // const result5 = await Promise.all(result4.map(async (x) => await Promise.all(x)));
                console.log('result4', result4);
                const final = result4.map((x) => x.join(''));
                // console.log('result5', result5);
                console.log('final', final);
                writeBrands(`${x1}${x2}${x3}\n`, final);
            }
            console.log('starting');
            await browser.url(webdriver.urls.mercari);
            // await browser.pause(1000);
            // await browser.keys(['Control', 'Shift', 'I']);
            // await browser.pause(1000);
            // await browser.keys(['Control', 'Shift', 'P']);
            // await browser.pause(1000);
            // await browser.keys(['e', 'm', 'f', 'o', 'ArrowDown', 'ArrowDown', 'Enter']);
            // await browser.pause(1000);
            await browser.$('[data-testid="LoginButton"]').click();
            await browser.$('[data-testid="EmailInput"]').setValue('bobby.kalaf.jr@gmail.com');
            await browser.$('[data-testid="PasswordInput"]').setValue('Achilles@92111');
            await browser.waitUntil(async () => {
                const value = await browser.$('[data-testid="PasswordInput"]').getValue();
                return value === 'Achilles@92111';
            });

            await browser.$('[data-testid="LoginSubmitButton"]').click();
            await browser.$('[data-testid="SellOnMercariCTA"]').waitForClickable({
                timeout: 50000
            });
            await browser.$('[data-testid="SellOnMercariCTA"]').click();

            const seqs = startBrands(log);
            await browser.pause(10000);

            // const seqs = [['r', 'o', 'o', 'm'], ['a', 'b', 'e', 'r'], ['t', 'a', 'r', 'g'],['a', 'b', 'b', 'i'],  ['a', 'b', 'b', ' ']] as [string, string, string, string][];
            await seqs.reduce((pv, cv) => pv.then((x) => inner(cv)), Promise.resolve());

            // console.log(`result`, await result.getHTML())
            // console.log(`result1`, result1);
            // console.log(`result2`, result2);
            // console.log(`result3`, result3);
            // console.log(`result4`, result4);
            // console.log(`result5`, result5);

            // .map(async y => await y.getText()));

            // console.log(result.map(x => x.join('')).join('\n'));

            // .$$('div > div')
            //     .map(async (el) => {
            //         return await el.$$('span > span').map(async (x) => {
            //             return await x.getText();
            //         });
            //     });
            // process.stdout.write(`${result.map((x) => `${x.join('')}\n`).join('')}]\n`);
            finishBrands(log);
            return;
        }
        run();
    }, [browser, log]);
    return <></>;
}

export function MainWindow() {
    const realm = useRealm();
    const location = useLocation();
    const navigate = useNavigate();
    const goBack = useCallback(() => navigate(-1), [navigate]);
    const metadata = useMetaDataContext();
    const [reader, updateReader] = useAsyncResource(createWebdriver, []);
    useDAL('self-storage');
    useDAL('facility');
    // useEffect(() => {
    //     async function run() {
    //         console.log('starting');
    //         await resource.url('https://www.google.com/');
    //         await resource.url('https://www.mercari.com/');
    //         return;
    //     }
    //     run();
    // }, [resource]);
    useEffect(() => {
        if (realm) {
            console.log(metadata.getType('self-storage'));
            console.log(metadata.getType('facility'));
            console.log(metadata.getControlList('self-storage'));
            console.log(metadata.getControlList('facility'));
            // console.log('new realm', realm);
            // console.log(schema.types);
            // console.log(schema.getType('self-storage'));
            // console.log(schema.getColumns('self-storage'));
            // console.log(schema.getColumns('facility'));
            // console.log(schema.getColumns('rental-unit'));
            // console.log(schema.getControls('facility'));
            // console.log(schema.getControls('self-storage'));
            // console.log(schema.getControls('rental-unit'));
        }
    }, [metadata, realm]);

    return (
        <div className='relative flex flex-col w-full h-full py-0.5'>
            <TopBar />
            <Test reader={reader} />
            <div className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-black transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-indigo-dark font-fira-sans mb-0.5 justify-center'>
                <ul className='flex flex-row justify-center p-1 space-x-1 text-black border border-white rounded-lg bg-slate-dark'>
                    <IconLinkButton to='/dashboard' title='Go to your dashboard.' icon={faHome} />
                    <IconButton icon={faArrowLeft} title='Go back 1 page.' onClick={goBack} />
                    <CommandButton icon={faPlusCircle} title='Insert a new record.' rVar={$insertCommand} />
                    {/* <CommandButton icon={faTrashAlt} title='Delete selected records.' rVar={$deleteCommand} /> */}
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
            <StatusBar />
            <Toaster />
        </div>
    );
}

export function LoginPage() {
    return <LoginForm></LoginForm>;
}
