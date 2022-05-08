"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const main_1 = require("@electron/remote/main");
const fs = __importStar(require("graceful-fs"));
let window = null;
(0, main_1.initialize)();
function createWindow() {
    window = new electron_1.BrowserWindow({
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
function getExtensionPath(extensionID) {
    const platformPath = process.platform === 'win32' ? 'C:/Users/bobby/AppData/Local/Google/Chrome/User/Data/Default/Extensions/' + extensionID : `/home/bobby/.config/google-chrome/Default/Extensions/${extensionID}`;
    const versionFolder = fs.readdirSync(platformPath)[0];
    const devToolsPath = [platformPath, versionFolder].join('/');
    console.log(devToolsPath);
    return devToolsPath;
}
function getDevToolsPath() {
    const platformPaths = process.platform === 'win32'
        ? `C:/Users/bobby/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi` : '/home/bobby/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi';
    // ? 'C:/Users/bobby/AppData/Local/Electron/extensions/fmkadmapgofadopljbjfkapdkoienihi'
    // : '/home/bobby/.config/google-chrome/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi';
    const versionFolder = fs.readdirSync(platformPaths)[0];
    const devToolsPath = [platformPaths, versionFolder].join('/');
    console.log(devToolsPath);
    return devToolsPath;
}
electron_1.app.on('ready', function () {
    return electron_1.session.defaultSession.loadExtension(getExtensionPath('fmkadmapgofadopljbjfkapdkoienihi'), { allowFileAccess: true }).then(() => electron_1.session.defaultSession.loadExtension(getExtensionPath('jdkknkkbebbapilgoeccciglkfbmbnfm'), { allowFileAccess: true })).then(() => createWindow()).then(() => {
        if (window == null)
            throw new Error('null window');
        window.webContents.openDevTools();
        (0, main_1.enable)(window.webContents);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsdUNBQXVEO0FBQ3ZELGdEQUEyRDtBQUMzRCxnREFBa0M7QUFFbEMsSUFBSSxNQUFNLEdBQXlCLElBQUksQ0FBQztBQUN4QyxJQUFBLGlCQUFVLEdBQUUsQ0FBQztBQUViLFNBQVMsWUFBWTtJQUNqQixNQUFNLEdBQUcsSUFBSSx3QkFBYSxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxHQUFHO1FBQ1gsS0FBSyxFQUFFLEdBQUc7UUFDVixjQUFjLEVBQUU7WUFDWixlQUFlLEVBQUUsSUFBSTtZQUNyQixXQUFXLEVBQUUsS0FBSztZQUNsQixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLFVBQVUsRUFBRSxHQUFHO1NBQ2xCO0tBQ0osQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xCLE1BQU0sQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsQ0FBQztBQUVELE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxLQUFLO0lBQzNDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFCLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdCLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDeEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxTQUFTLGdCQUFnQixDQUFDLFdBQW1CO0lBQ3pDLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUMsQ0FBQywwRUFBMEUs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