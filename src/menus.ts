import { makeVar } from '@apollo/client';
import { BrowserWindow, ipcMain, MenuItem, Menu, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import * as fs from 'graceful-fs';
import { attemptToGetFileName } from './util/attemptToGetFileName';

export let $galleryChoice: Promise<[boolean, string?]> = Promise.resolve([false]);
export let $resolvers: [(x: any) => void, (x: any) => void] | undefined;
const galleryContextMenu = Menu.buildFromTemplate([
    {
        type: 'normal',
        label: 'Delete photo',
        toolTip: 'This is an unrecoverable operation.',
        click: (menuItem: MenuItem, window: BrowserWindow, event: KeyboardEvent) => {
            console.log('MENU CLICKED');
            console.log(event);
            console.log(menuItem);
            const target: HTMLElement = event.target as any;
            const filename = attemptToGetFileName(target) ?? '';
            if (!fs.existsSync(filename)) throw new Error('bad filename attribute ' + filename);
            $resolvers![0]([true, filename]);
            $resolvers = undefined;
        }
    }
] as any);

const menus: Record<string, Menu> = ({
    gallery: galleryContextMenu
});

export function     registerMenus() {
    ipcMain.handle('open-context-menu', async function (event: IpcMainInvokeEvent, key: string) {
        $galleryChoice = new Promise((res, rej) => {
            $resolvers = [res,rej];
        });
        (menus[key]).popup();
        const [isDeleting, name] = await $galleryChoice;
        if (isDeleting) return name;
        return undefined;
    });
    ipcMain.handle('close-context-menu', function (event: IpcMainInvokeEvent, key: string) {
        (menus[key]).closePopup();
        if ($resolvers) $resolvers[0]!([false]);
    });
}