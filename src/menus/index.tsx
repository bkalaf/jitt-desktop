import * as fs from 'graceful-fs';

import { faBinoculars, faDatabase, faDoorClosed, faWindowClose, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { BrowserWindow, ipcMain, MenuItem, nativeImage } from 'electron';
import { NavigateFunction, useNavigate } from 'react-router';
import { ignore, toTitleCase } from '../common';
import { pluralize } from "../data/enums/pluralize";
import { makeVar } from '@apollo/client';

export function createElectronIcon(iconDef: IconDefinition) {
    console.log(iconDef);
    const fullpath = [__dirname, `./src/assets/fortawesome/svgs/duotone/${iconDef.iconName}.svg`].join('/');
    return fs.existsSync(fullpath) ? nativeImage.createFromBuffer(fs.readFileSync(fullpath)) : undefined;
}

export function toClick(coll: string, prefix = 'data') {
    return (_menuItem: MenuItem, _browser: BrowserWindow, ev: Event) => {
        const to = ['', prefix, 'v1', coll].join('/');
        BrowserWindow.getAllWindows()[0].webContents.send('navigate-to', to);
    };
}

export function navTo(...parts: string[]) {
    return (_menuItem: MenuItem, _browser: BrowserWindow, ev: Event) => {
        const to = ['', ...parts].join('/');
        BrowserWindow.getAllWindows()[0].webContents.send('navigate-to', to);
    };
}

export const leaf = (route: string, label?: string) => ({ type: 'normal', label: label == null ? toTitleCase(pluralize(route)) : toTitleCase(pluralize(label.toLowerCase())), click: toClick(route) });


export type QueueState = { name: string; running: boolean; paused: boolean }
export type QueueStates = {
    skuPrinter: QueueState;
}
export const $queues = makeVar<QueueStates>({
    skuPrinter: {
        name: 'sku-printer',
        running: false,
        paused: false
    }
});

export const topBar = ({ skuPrinter }: { skuPrinter: QueueState }) => [
    {
        type: 'submenu',
        role: 'fileMenu'
    },
    {
        type: 'submenu',
        role: 'editMenu'
    },
    { type: 'submenu', role: 'viewMenu' },
    {
        type: 'submenu',
        label: 'Data',
        submenu: [
            {
                type: 'submenu',
                label: 'Auctions',

                submenu: [
                    leaf('self-storage'),
                    leaf('facility'),
                    leaf('rental-unit'),
                    leaf('purchase')
                ]
            },
            {
                type: 'submenu',
                label: 'Inventory',
                submenu: [
                    leaf('barcode'),
                    leaf('location'),
                    leaf('fixture'),
                    leaf('bin'),
                    leaf('item')
                ]
            },
            {
                type: 'submenu',
                label: 'Products',
                submenu: [
                    leaf('item-type'),
                    leaf('company'),
                    leaf('brand'),
                    leaf('product-line'),
                    leaf('product')
                ]
            },
            { 
                type: 'submenu',
                label: 'Files',
                submenu: [
                    leaf('photo'),
                    leaf('product-documentation')
                ]       
            },
            {
                type: 'submenu',
                label: 'Scrapes',
                submenu: [
                    leaf('category'),
                    leaf('taxonomy'),
                    leaf('verified-brand'),
                    leaf('custom-item'),
                    leaf('custom-item-entry')
                ]
            }
        ]
    },
    { type: 'submenu', label: 'Queues', submenu: [
        { type: 'submenu', label: 'SKU Printer', submenu: [
            { type: 'normal', label: 'Running', enabled: skuPrinter.running, click: function(_menuItem: MenuItem, _browser: BrowserWindow, ev: Event) {
                $queues({ ...$queues(), skuPrinter: { ...skuPrinter, running: !skuPrinter.running }});
            }}
        ]}
    ] },
    { type: 'submenu', label: 'Actions', submenu: [
        { type: 'normal', label: ''}
    ]},
    { type: 'submenu', label: 'Tags', submenu: [
        { type: 'normal', label: 'Increment-Inventory', click: navTo('api', 'v1', 'new-inventory-tag') },
        { type: 'normal', label: 'Increment-Item', click: navTo('api', 'v1', 'new-item-tag') },
        { type: 'separator' },
        { type: 'normal', label: 'Print Tags', click: navTo('api', 'v1', 'print-tags' )}
    ] },
    { type: 'submenu', role: 'windowMenu', submenu: [] },
    { type: 'normal', label: 'Help', role: 'help', click: ignore },
    { type: 'normal', label: 'About', role: 'about', click: ignore }
] as any[];

// const menuIcons = {
//     undo: addIcon(JITTMenu.)(),
//     redo: icon(faRedo),
//     exit: icon(faDoorClosed),
//     close: icon(faWindowClose),
//     data: icon(faDatabase),
//     zoomIn: icon(faMagnifyingGlassPlus),
//     zoomOut: icon(faMagnifyingGlassMinus),
//     resetZoom: icon(faBinoculars),
//     about: icon(faCommentDots)
// };
// export const mainMenu = (nav: (to: string) => () => void) => [
//     JITTMenu.toNavRoledSubMenu('File', 'fileMenu', undefined, JITTMenu.toNavRoledItem('Close', 'close', undefined), JITTMenu.toNavRoledItem('Quit', 'quit')),
//     JITTMenu.toNavRoledSubMenu(
//         'Edit',
//         'editMenu',
//         undefined,
//         addIcon(faUndo)(JITTMenu.toNavRoledItem('Undo', 'undo')),
//         JITTMenu.toNavRoledItem('Redo', 'redo'),
//         JITTMenu.toSeparator(),
//         JITTMenu.toNavRoledItem('Cut', 'cut'),
//         JITTMenu.toNavRoledItem('Copy', 'copy'),
//         JITTMenu.toNavRoledItem('Paste', 'paste'),
//         JITTMenu.toNavRoledItem('Paste w/ Styles', 'pasteAndMatchStyle')
//     ),
//     JITTMenu.toNavRoledSubMenu('Window', 'windowMenu', undefined, JITTMenu.toNavRoledItem('Zoom-In', 'zoomIn'), JITTMenu.toNavRoledItem('Zoom-Out', 'zoomOut'), JITTMenu.toNavRoledItem('Reset Zoom', 'resetZoom')),
//     JITTMenu.toNavSection(
//         'Database',
//         'collections',
//         JITTMenu.toNavSection(
//             'Storage',
//             'auctions and facilities',
//             JITTMenu.toNavItem(nav).data('self-storage', 'Storage Companies'),
//             JITTMenu.toNavItem(nav).data('facility', 'Facilities'),
//             JITTMenu.toNavItem(nav).data('rental-unit', 'Rental Units'),
//             JITTMenu.toNavItem(nav).data('purchase', 'Purchases')
//         ),
//         JITTMenu.toSeparator(),
//         JITTMenu.toNavSection(
//             'Products',
//             'uniquely identifiable item-to-sell',
//             JITTMenu.toNavItem(nav).data('company', 'Company'),
//             JITTMenu.toNavItem(nav).data('brand', 'Brands'),
//             JITTMenu.toNavItem(nav).data('product-line', 'Product Lines'),
//             JITTMenu.toNavItem(nav).data('item-type', 'Item Types'),
//             JITTMenu.toNavItem(nav).data('product', 'Product')
//         ),

//         JITTMenu.toSeparator(),

//         JITTMenu.toSeparator(),

//         JITTMenu.toSeparator(),
//         JITTMenu.toNavSection(
//             'Automation',
//             'web-scrapes, api-fetches, etc.',
//             JITTMenu.toNavItem(nav).data('category', 'Item Categories'),
//             JITTMenu.toNavItem(nav).data('taxonomy', 'Categorization'),
//             JITTMenu.toNavItem(nav).data('verified-brand', 'Brand Mapping')
//         ),
//         JITTMenu.toSeparator(),
//         JITTMenu.toNavSection(
//             'Files',
//             'images, documents, etc.',
//             JITTMenu.toNavItem(nav).data('photo', 'Product Photos'),
//             JITTMenu.toNavItem(nav).data('fs-alloc', 'File Allocation'),
//             JITTMenu.toNavItem(nav).data('fs-item', 'File Item')
//         ),
//         JITTMenu.toSeparator()
//     ),
//     JITTMenu.toNavSection('Reports', 'reporting'),
//     JITTMenu.toNavSection('HTTP', 'data-gathering'),
//     JITTMenu.toNavSection('Tasks', 'task management'),
//     JITTMenu.toNavRoledSubMenu('Help', 'help'),
//     JITTMenu.toNavRoledSubMenu('About', 'about')
// ];
