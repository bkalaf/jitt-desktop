/* eslint-disable react/boolean-prop-naming */
import { faArrowLeft, faFileInvoiceDollar, faHome, faPlusCircle, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopBar } from './TopBar';
import { LoginForm } from './forms/LoginForm';
import { Toaster, useMetaDataContext } from './Toaster';
import { LeftSidebar } from './LeftSidebar';
import { IconLinkButton } from './Buttons/IconLinkButton';
import { $insertCommand } from './App';
import { MainRouter } from './MainRouter';
import { useRealm } from '../hooks/useRealm';
import { $cn } from '../util/$cn';
import { CommandButton } from './Buttons/CommandButton';
import { StatusBar } from './StatusBar';
import { createWebdriver } from './providers/WebdriverProvider';
import * as Webdriver from 'webdriverio';
import { DataOrModifiedFn, LazyDataOrModifiedFn, useAsyncResource } from 'use-async-resource';
import * as fs from 'graceful-fs';
import { charRange, ignore } from '../common';
import { webdriver } from '../config/webdriver';
import { APP_CONFIG, files } from '../config';
import { readFile } from './readFile';
import { writeFile } from './writeFile';
import { makeVar, useReactiveVar } from '@apollo/client';
import { useMutation, useQueryClient } from 'react-query';
import { updateFile } from '../queries/insertMutation';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { FileAlloc, mongo } from '../data';
import { useSelected } from '../hooks/useSelected';
import { checkDirectory } from './checkDirectory';
import path from 'path';
import { isNotNil } from '../common/isNotNull';

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

export function clickById(browser: Webdriver.Browser<'async'>) {
    return async function (selector: string) {
        const el = await browser.$($selector.id(selector));
        await el.waitForExist({ timeout: 20000 });
        await el.click();
    };
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
export function ifNotExistDo(browser: Webdriver.Browser<'async'>, log: any) {
    return async function (existSelector: string, clickSelector: [string, string]) {
        const el = await browser.$($selector.id(existSelector));
        if (!(await el.isExisting())) {
            log(`not existsing: ${existSelector} clicking: ${clickSelector}`);
            await click(browser)(clickSelector);
        }
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
const idAttribute = (id: string) => `#${id}`;
export const $selector = {
    data: dataAttribute,
    id: idAttribute
};

export const $showFileTools = makeVar<boolean>(false);

export function useAssignFile(): [boolean, () => void] {
    return [true, ignore];
}

export function moveFile(src: string, destination: string) {
    checkDirectory(path.dirname(destination));
    if (!fs.existsSync(src)) {
        throw new Error('source does not exist');
    }
    fs.renameSync(src, destination);
}

export function useChangeFileParent(): [boolean, (parent: string, id?: string) => void] {
    const realm = useLocalRealm();
    const selected = useSelected();
    const queryClient = useQueryClient();
    const mutation = useMutation(updateFile(realm, mongo.fsAlloc), {
        onSuccess: ([src, dest]: [string, string]) => {
            queryClient.invalidateQueries(['selectAll', mongo.fsAlloc]);
            queryClient.invalidateQueries(['dropdown', mongo.fsAlloc]);
            queryClient.refetchQueries(['selectAll', mongo.fsAlloc]);
            queryClient.refetchQueries(['dropdown', mongo.fsAlloc]);
            moveFile([APP_CONFIG.fs.path, src].join(''), [APP_CONFIG.fs.path, dest].join(''));
        }
    });
    const [isLoading, startTransition] = useTransition();
    const onClick = useCallback(
        (matPath: string, id?: string) => {
            const parent = realm.objects<FileAlloc>(mongo.fsAlloc).filtered(`materializedPath == '${matPath}'`)[0];
            const current = realm.objectForPrimaryKey<FileAlloc>(mongo.fsAlloc, new Realm.BSON.ObjectId(selected[0]));
            startTransition(() =>
                mutation.mutate({
                    id: isNotNil(selected[0]) ? selected[0] : id!,
                    data: { parent, materializedPath: [parent.materializedPath, current?.name].join('/') }
                })
            );
        },
        [mutation, realm, selected]
    );
    return [isLoading, onClick];
}
export function useAssignInvoice(): [boolean, () => void] {
    const realm = useLocalRealm();
    const [isLoading, moveFile] = useChangeFileParent();
    const execute = useCallback(() => moveFile('/auctions/invoices'), [moveFile]);
    return [isLoading, execute];
}
export function ToolBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const goBack = useCallback(() => {
        navigate(location.pathname.split('/').reverse().slice(1).reverse().join('/'));
        // navigate('..');
    }, [location.pathname, navigate]);
    const showFileTools = useReactiveVar($showFileTools);
    const [isSavingInvoice, saveToInvoice] = useAssignInvoice();
    const selected = useSelected();
    const isSelected = selected.length > 0;
    return (
        <div className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-black transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-indigo-dark font-fira-sans mb-0.5 justify-center space-x-4'>
            <ul className='flex flex-row justify-center p-1 space-x-1 text-black border border-white rounded-lg bg-slate-dark'>
                <IconLinkButton to='/dashboard' title='Go to your dashboard.' icon={faHome} />
                <IconButton icon={faArrowLeft} title='Go back 1 page.' onClick={goBack} />
                <CommandButton icon={faPlusCircle} title='Insert a new record.' rVar={$insertCommand} />
                {/* <CommandButton icon={faTrashAlt} title='Delete selected records.' rVar={$deleteCommand} /> */}
            </ul>
            {showFileTools && (
                <ul className='flex flex-row justify-center p-1 space-x-1 text-black border border-white rounded-lg bg-slate-dark'>
                    {isSavingInvoice ? (
                        <span className='inline-flex'>Saving</span>
                    ) : (
                        <IconButton icon={faFileInvoiceDollar} title='Assign to invoice' onClick={saveToInvoice} disabled={!isSelected} />
                    )}
                </ul>
            )}
        </div>
    );
}

export function MainWindow({ realmReader }: { realmReader: LazyDataOrModifiedFn<Realm> }) {
    const realm = realmReader();
    const location = useLocation();
    const navigate = useNavigate();
    const metadata = useMetaDataContext();
    const [reader, updateReader] = useAsyncResource(createWebdriver);
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
