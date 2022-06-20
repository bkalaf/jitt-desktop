import * as fs from 'graceful-fs';

import {
    faBinoculars,
    faDatabase,
    faDoorClosed,
    
    faWindowClose,
    IconDefinition
} from '@fortawesome/pro-duotone-svg-icons';
import { BrowserWindow, MenuItem, nativeImage } from 'electron';
import { NavigateFunction, useNavigate } from 'react-router';
import { ignore } from '../common';

export function createElectronIcon(iconDef: IconDefinition) {
    console.log(iconDef);
    const fullpath = [__dirname, `./src/assets/fortawesome/svgs/duotone/${iconDef.iconName}.svg`].join('/');
    return fs.existsSync(fullpath) ? nativeImage.createFromBuffer(fs.readFileSync(fullpath)) : undefined;
}

export function toClick(navigate: ReturnType<typeof useNavigate>, coll: string, prefix = 'data') {
    return (_menuItem: MenuItem, _browser: BrowserWindow, ev: Event) => {
        return navigate(['', prefix, 'v1', coll].join('/'));
    };
}
export const topBar: (navigate: ReturnType<typeof useNavigate>) => any = (navigate: NavigateFunction) =>
    [
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
                        { type: 'normal', label: 'Self Storage', click: toClick(navigate, 'self-storage') },
                        { type: 'normal', label: 'Facility', click: toClick(navigate, 'facility') }
                    ]
                }
            ]
        },
        { type: 'submenu', role: 'windowMenu', submenu: [] },
        { type: 'normal', label: 'Help', role: 'help', click: (a, b, c) =
         {}  },
        { type: 'normal', label: 'About', role: 'about', click: (a, b, c) =
         {} }
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
