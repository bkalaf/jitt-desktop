import * as fs from 'graceful-fs';
import { photoRoot } from './photoRoot';
import { ipcMain } from 'electron';
import { APP_CONFIG } from '../config';
import { rembg } from './rembg';
import { mogrifyToPNG } from './mogrifyToPNG';
import { checkDirectory } from '../common/fs/checkDirectory';
import { runCmd, runCmdSync } from './cli';

const log = (x: string) => process.stdout.write(`${x}\n`);

const photoFinalName = (sku: string) => {
    const folder = [APP_CONFIG.fs.path, 'items', sku, 'images'].join('/');
    const count = fs.readdirSync(folder).length;
    return [folder, `image-${count + 1}.png`].join('/');
};

export function escapeFileName(fn: string) {
    return fn.split(' ').join('\\ ');
}

export function renameFile(start: string, end: string) {
    if (!fs.existsSync(start)) throw new Error('file does not exist');
    // return runCmd('mv', start, end);
    runCmdSync('mv', escapeFileName(start), escapeFileName(end));
}

export function handlePayload(
    event: Electron.IpcMainEvent,
    { name, folder, stage, barcode }: { name: string; folder: string; stage: string; barcode: string }
) {
    log(`handlePayload: ${JSON.stringify({ barcode, name, folder, stage })}`);
    switch (stage) {
        case 'upload': {
            console.log('HANDLING: UPLOAD');
            renameFile([folder, name].join('/'), [photoRoot, name].join('/'));
            event.reply('photo-continue', 'convert', photoRoot, name);
            // ipcMain.emit('enqueue-photo-pipeline', photoRoot, name, 'convert');
            break;
        }
        case 'removebg': {
            console.log('HANDLING: REMBG');

            const newName = [name.split('.')[0], '-final.', name.split('.')[1]].join('');
            rembg([folder, newName].join('/'), [folder, name].join('/'));
            // fs.unlinkSync([folder, name].join('/'));
            console.log('BACKGROUND REMOVED');
            break;
        }
        case 'assign': {
            console.log('HANDLING: ASSIGN');

            const bc = barcode;
            const newName = photoFinalName(bc);
            const oldName = name;
            renameFile([folder, name].join('/'), newName);
            event.reply('photo-assigned', oldName, newName, bc);
            break;
        }
        case 'convert': {
            console.log('HANDLING: CONVERT');

            mogrifyToPNG([folder, name].join('/'));
            const [newFolder, newName] = [folder, [name.split('.')[0], 'png'].join('.')];
            event.reply('photo-continue', 'removebg', newFolder, newName);
            // ipcMain.emit('enqueue-photo-pipeline', newFolder, newName, 'removebg');
            break;
        }

        default:
            break;
    }
}
