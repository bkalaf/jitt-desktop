
import { app, BrowserWindow, session } from 'electron';
import { enable, initialize } from '@electron/remote/main';
import * as fs from 'graceful-fs';

let window: BrowserWindow | null = null;
initialize();

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
    const platformPath = process.platform === 'win32' ? 'C:/Users/bobby/AppData/Local/Google/Chrome/User/Data/Default/Extensions/' + extensionID : `/home/bobby/.config/google-chrome/Default/Extensions/${extensionID}`;
    const versionFolder = fs.readdirSync(platformPath)[0];
    const devToolsPath = [platformPath, versionFolder].join('/');
    console.log(devToolsPath);
    return devToolsPath;
}
function getDevToolsPath() {
    const platformPaths =
        process.platform === 'win32'
            ? `C:/Users/bobby/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi` : '/home/bobby/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi';
    // ? 'C:/Users/bobby/AppData/Local/Electron/extensions/fmkadmapgofadopljbjfkapdkoienihi'
    // : '/home/bobby/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi';
    const versionFolder = fs.readdirSync(platformPaths)[0];
    const devToolsPath = [platformPaths, versionFolder].join('/');
    console.log(devToolsPath);
    return devToolsPath;

}
app.on('ready', function () {
    return session.defaultSession.loadExtension(getExtensionPath('fmkadmapgofadopljbjfkapdkoienihi'), { allowFileAccess: true }).then(() =>
        session.defaultSession.loadExtension(getExtensionPath('jdkknkkbebbapilgoeccciglkfbmbnfm'), { allowFileAccess: true })).then(() => createWindow()).then(() => {
            if (window == null) throw new Error('null window');
            window.webContents.openDevTools();
            enable(window.webContents);
            window.webContents.on('did-finish-load', () => console.log('finished loading...'));
        });
});


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
//     );

//     window!.webContents.on(
//         'did-fail-load', function (err) {
//             console.log('loading finished');
//             process.stdout.write('error');
//             console.log(err);
//         }
//     );
// });
