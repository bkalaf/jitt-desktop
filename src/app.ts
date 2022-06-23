import { app, BrowserWindow, ipcMain, Menu, MenuItem, session } from 'electron';
import { enable, initialize } from '@electron/remote/main';
import * as fs from 'graceful-fs';
import './msgqueue';
import amqp from 'amqplib';
import { log } from 'console';
import { handlePayload } from './msgqueue/photoPipeline';
import { rabbitMqHandler } from './msgqueue';
import { registerMenus } from './menus';
import { topBar } from './menus/index';

let window: BrowserWindow | null = null;
initialize();
export const $$rabbitMQ = 'amqp://localhost';

function createWindow() {
    window = new BrowserWindow({
        height: 400,
        width: 400,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: false,
            zoomFactor: 1.0
        }
    });
    window.maximize();
    window.loadFile('./index.html');
}

process.on('uncaughtException', function (error) {
    console.error(error.name);
    console.error(error.message);
    process.stdout.write(error.name);
    process.stdout.write(error.message);
});

function getExtensionPath(extensionID: string) {
    const platformPath =
        process.platform === 'win32'
            ? 'C:/Users/bobby/AppData/Local/Google/Chrome/User/Data/Default/Extensions/' + extensionID
            : `/home/bobby/.config/google-chrome/Default/Extensions/${extensionID}`;
    const versionFolder = fs.readdirSync(platformPath)[0];
    const devToolsPath = [platformPath, versionFolder].join('/');
    console.log(devToolsPath);
    return devToolsPath;
}
const ttsID = 'npdkkcjlmhcnnaoobfdjndibfkkhhdfn';
function ttsPath() {
    const platformPaths = process.platform === 'win32' ? `C:/Users/bobby/AppData/Local/Google/Chrome/User Data/Default/Extensions/npdkkcjlmhcnnaoobfdjndibfkkhhdfn` : '/home/bobby/.config/google-chrome/Default/Extensions/npdkkcjlmhcnnaoobfdjndibfkkhhdfn';
    const versionFolder = fs.readdirSync(platformPaths)[0];
    const devToolsPath = [platformPaths, versionFolder].join('/');
    console.log(devToolsPath);
    return devToolsPath;
}
function getDevToolsPath() {
    const platformPaths =
        process.platform === 'win32'
            ? `C:/Users/bobby/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi`
            : '/home/bobby/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi';
    // ? 'C:/Users/bobby/AppData/Local/Electron/extensions/fmkadmapgofadopljbjfkapdkoienihi'
    // : '/home/bobby/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi';
    const versionFolder = fs.readdirSync(platformPaths)[0];
    const devToolsPath = [platformPaths, versionFolder].join('/');
    console.log(devToolsPath);
    return devToolsPath;
}

app.on('ready', function () {
    return session.defaultSession
        .loadExtension(getExtensionPath('fmkadmapgofadopljbjfkapdkoienihi'), { allowFileAccess: true })
        .then(() => session.defaultSession.loadExtension(getExtensionPath('jdkknkkbebbapilgoeccciglkfbmbnfm'), { allowFileAccess: true }))
        .then(() => session.defaultSession.loadExtension(ttsPath(), { allowFileAccess: true }))
        .then(() => createWindow())
        .then(() => {
            if (window == null) throw new Error('null window');
            window.webContents.openDevTools();
            enable(window.webContents);
            window.webContents.on('did-finish-load', () => console.log('finished loading...'));
        })
        .then(() => registerMenus())
        .then(() => {
            const template = Menu.buildFromTemplate(topBar);
            Menu.setApplicationMenu(template);
        });
});

ipcMain.on('enable-photo-pipeline', (event: Electron.IpcMainEvent) => {
    async function consume(msg: amqp.ConsumeMessage | null) {
        if (msg == null) throw new Error('photo-pipeline, empty data');
        const payload = JSON.parse(msg.content.toString());
        handlePayload(event, payload);
        return msg;
    }
    async function internal() {
        const connection = await amqp.connect($$rabbitMQ);
        const channel = await connection.createChannel();
        const asserted = await channel.assertQueue('photo-pipeline');
        log(`photo-pipeline queue: ${asserted.messageCount}`);
        log(`photo-pipeline consumers: ${asserted.consumerCount}`);
        await channel.prefetch(1);
        await channel.consume('photo-pipeline', (data: amqp.ConsumeMessage | null) => {
            consume(data).then((m) => {
                setTimeout(() => channel.ack(m), 400);
                return m;
            }).catch(console.error);
        });
    }
    console.log(`event`, event);
    internal().then(() => {
        console.log('internal:ran:photo-pipeline');
        log('internal:ran:photo-pipeline');
    });
});
ipcMain.on('new-scan', (event: Electron.IpcMainEvent, scan: string) => {
    async function enqueue() {
        try {
            const connection = await amqp.connect($$rabbitMQ);
            const channel = await connection.createChannel();
            const queue = await channel.assertQueue('scans');
            channel.sendToQueue(queue.queue, Buffer.from(scan), { persistent: true });
            setTimeout(() => connection.close(), 2000);
        } catch (error) {
            console.error((error as any).name);
            console.error((error as any).message);
            throw error;
        }
    }
    console.log('received: new-scan');
    enqueue().then(x => console.log('enqueued'));
});

ipcMain.on(
    'enqueue-photo-pipeline',
    rabbitMqHandler('photo-pipeline', (...args: string[]) => {
        console.log('photo-pipeline-msg', args);
        console.log('photo-pipeline-msg', {
            folder: args[0],
            name: args[1],
            stage: args[2]
        });
        return {
            folder: args[0],
            name: args[1],
            stage: args[2]
        };
    })
);
ipcMain.on(
    'enqueue-assigned-photo',
    rabbitMqHandler('photo-pipeline', (...args: string[]) => {
        return {
            folder: args[0],
            name: args[1],
            stage: args[2],
            barcode: args[3]
        };
    })
);

// const browser: Promise<WebdriverIO.Browser> = Webdriver.remote({
//     logLevel: 'trace',
//     capabilities: {
//         browserName: 'chrome'
//     }
// });

// ipcMain.handle('webdriver::url', async (event, url: string) => {
//     const b = await browser;
//     return b.url(url);
// });
// ipcMain.handle('webdriver::click', async (event, selector: string) => {
//     const b = await browser;
//     return b.$(selector).click();
// });
// ().then(async () => {
//     // await session.defaultSession.loadExtension(getDevToolsPath(), { allowFileAccess: true });
//     // await session.defaultSession.loadExtension(getExtensionPath('jdkknkkbebbapilgoeccciglkfbmbnfm'), { allowFileAccess: true });
//     // createWindow();
//     // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
//     createWindow();
//     window?.webContents.openDevTools();
//     // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
//     enable(window?.webContents!);
//     window!.webContents.on(
//         'did-finish-load', function (_ev: any) {
//             console.log('loading finished');
//             process.stdout.write('finished loading');
//         }
//     );>
//         'did-fail-load', function (err) {
//             console.log('loading finished');
//             process.stdout.write('error');
//             console.log(err);
//         }
//     );
// });
