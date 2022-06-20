import { nativeImage } from 'electron';
import { toTitleCase } from '../common';
import * as fs from 'graceful-fs';

function _createIcon(fn: string) {
    return nativeImage.createFromBuffer(fs.readFileSync(fn));
}

export function _toNavItem(prefix: string, nav: (to: string) => () => void) {
    return (to: string, label?: string) => ({ type: 'normal', label: label ?? toTitleCase(to), click: nav([prefix, to].join('/')) } as Partial<Electron.MenuItem>);
}

function iconItem(inner: typeof _toNavItem) {
    return function (prefix: string, nav: (to: string) => () => void, to: string, fn: string, label?: string): Partial<Electron.MenuItem> {
        const result = { ...inner(prefix, nav)(to, label), icon: _createIcon(fn) };
        return result;
    };
}

const toNavItem = (nav: any) => ({
    fs: _toNavItem('/fs/v1', nav),
    api: _toNavItem('/api/v1', nav),
    data: _toNavItem('/data/v1', nav)
});
export type MenuItemRole =
    | 'about' // ABOUT
    | 'appMenu'
    | 'clearRecentDocuments'
    | 'close' // FILE
    | 'copy' // EDIT
    | 'cut' // EDIT
    | 'delete'
    | 'editMenu'
    | 'fileMenu'
    | 'forceReload'
    | 'front'
    | 'help'
    | 'hide'
    | 'hideOthers'
    | 'mergeAllWindows'
    | 'minimize'
    | 'moveTabToNewWindow'
    | 'paste' // EDIT
    | 'pasteAndMatchStyle'
    | 'quit' // FILE
    | 'recentDocuments'
    | 'redo'
    | 'reload'
    | 'resetZoom'
    | 'selectAll'
    | 'selectNextTab'
    | 'selectPreviousTab'
    | 'services'
    | 'shareMenu'
    | 'startSpeaking'
    | 'stopSpeaking'
    | 'toggleDevTools'
    | 'togglefullscreen'
    | 'toggleSpellChecker'
    | 'toggleTabBar'
    | 'undo'
    | 'unhide'
    | 'viewMenu'
    | 'window'
    | 'windowMenu'
    | 'zoom'
    | 'zoomIn'
    | 'zoomOut';

const toNavSection = (label: string, sublabel?: string, iconPath?: string, ...items: Partial<Electron.MenuItem>[]): Partial<Electron.MenuItem> => ({
    type: 'submenu',
    label,
    sublabel,
    icon: iconPath ? _createIcon(iconPath) : undefined,
    toolTip: `Expand the ${label.toLowerCase()} sub-menu`,
    submenu: items as any
});

const toNavRole =
    (type: any) =>
    (label: string, role: MenuItemRole, sublabel?: string | undefined, ...items: Array<Partial<Electron.MenuItem>>): Partial<Electron.MenuItem> => ({
        type,
        label,
        sublabel,
        role,
        submenu: items as any
    });

const toNavRoledSubMenu = toNavRole('submenu');
const toNavRoledItem = toNavRole('normal');
const toSeparator = (): Partial<Electron.MenuItem> => ({ type: 'separator' });

export const JITTMenu = {
    toNavItem,
    toNavIconItem: iconItem,
    toNavRole,
    toNavRoledItem,
    toNavRoledSubMenu,
    toNavSection,
    toSeparator
};
