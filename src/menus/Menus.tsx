import { MenuItemRole } from '../settings';
import * as fs from 'graceful-fs';
import { nativeImage, MenuItem, Menu } from 'electron';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { fromCamelToKebabCase } from '../common';
import { IconDefinition } from '@fortawesome/pro-duotone-svg-icons';

export type MenuItemType = 'normal' | 'separator' | 'submenu' | 'checkbox' | 'radio';
export function useMenuItem(): (
    type: MenuItemType,
    prefix: string,
    collection?: string,
    label?: string,
    iconName?: string,
    sublabel?: string,
    role?: MenuItemRole,
    toolTip?: string
) => Partial<MenuItem> | ((submenu: Menu) => Partial<MenuItem>) {
    return function ElectronMenuItem<T extends MenuItemType>(
        type: T,
        prefix: string,
        collection?: string,
        label?: string,
        iconName?: string,
        sublabel?: string,
        role?: MenuItemRole,
        toolTip?: string
    ): T extends 'submenu' ? (submenu: Menu) => Partial<MenuItem> : Partial<MenuItem> {
        const navigate = useNavigate();
        const to = ['', prefix, 'v1', collection].join('/');
        const icon = iconName ? nativeImage.createFromBuffer(fs.readFileSync([`./../assets/fortawesome/svgs/duotone/${fromCamelToKebabCase(iconName)}.svg`].join('/'))) : undefined;
        const click = useCallback(() => {
            navigate(to);
        }, [navigate, to]);

        return type === 'submenu'
            ? (submenu: Electron.Menu) => ({
                  type,
                  label,
                  sublabel,
                  role: role as any,
                  toolTip,
                  icon,
                  submenu
              })
            : ({
                  click,
                  type,
                  label,
                  sublabel,
                  role: role as any,
                  toolTip,
                  icon
              } as any);
    };
}



// export function useCreateMenu() {
//     const Component = useMenuItem();

//     const fileMenu = Component('submenu', 'data', undefined, 'File', 'file', undefined, 'fileMenu');
//     const fileMenu1 = Component('normal', 'data', undefined, 'Quit', 'windowClose', undefined, 'quit') as MenuItem;

//     const editMenu = Component('submenu', 'data', undefined, 'Edit', 'pen', undefined, 'editMenu') as (submenu: Menu) => Partial<MenuItem>;
//     const editMenu1 = Component('normal', 'data', undefined, 'Undo', 'trashUndo', undefined, 'undo');
//     const editMenu2 = Component('normal', 'data', undefined, 'Redo', 'trashRedo', undefined, 'undo');
//     const editMenu3 = Component('normal', 'data', undefined, 'Cut', 'cut', undefined, 'cut');
//     const editMenu4 = Component('normal', 'data', undefined, 'Copy', 'copy', undefined, 'copy');
//     const editMenu5 = Component('normal', 'data', undefined, 'Paste', 'paste', undefined, 'paste');
//     const windowMenu = Component('submenu', 'data', undefined, 'Window', 'windowAlt', undefined, 'windowMenu') as (submenu: Menu) => Partial<MenuItem>;

//     const helpMenu = Component('submenu', 'data', undefined, 'Help', 'commentsQuestion', undefined, 'help');
//     const aboutMenu = Component('submenu', 'data', undefined, 'Help', 'questionCircle', undefined, 'about');
//     const viewMenu = Component('submenu', 'data', undefined, 'View', 'frame', undefined, 'viewMenu');
//     const viewMenu1 = Component('normal', 'data', undefined, 'Zoom In', 'magnifyingGlassPlus', undefined, 'zoomIn');
//     const viewMenu2 = Component('normal', 'data', undefined, 'Zoom Out', 'magnifyingGlassMinus', undefined, 'zoomOut');
//     const viewMenu3 = Component('normal', 'data', undefined, 'Reset Zoom', 'binoculars', undefined, 'resetZoom');

//     const dataMenu = Component('submenu', 'data', undefined, 'Data', 'database', undefined, undefined);
//     const dataMenu1 = Component('submenu', 'data', undefined, 'Auctions', 'coins', undefined, undefined);
//     const dataMenu1a = Component('normal', 'data', 'self-storage', 'Storage Companies', 'awardSimple', undefined, undefined);
//     const dataMenu1b = Component('normal', 'data', 'facility', 'Facilities', 'cartFlatbedBoxes', undefined, undefined);
//     const dataMenu1c = Component('normal', 'data', 'rental-unit', 'Rental Units', 'mapLocation', undefined, undefined);
//     const dataMenu1d = Component('normal', 'data', 'purchase', 'Purchases', 'creditCardBlank', undefined, undefined);
//     const dataMenu2 = Component('submenu', 'data', undefined, 'Listings', 'newspaper', undefined, undefined);
//     const dataMenu2a = Component('normal', 'data', 'draft', 'Drafts', 'rulerCombined', undefined, undefined);
//     const dataMenu3 = Component('submenu', 'data', undefined, 'Products', 'tags', undefined, undefined);
//     const dataMenu3a = Component('submenu', 'data', 'company', 'Companies', 'building', undefined, undefined);
//     const dataMenu3b = Component('normal', 'data', 'brand', 'Brands', 'signHanging', undefined, undefined);
//     const dataMenu4a = Component('normal', 'data', 'barcode', 'Barcode', 'barcodeRectangle', undefined, undefined);
//     const dataMenu4b = Component('normal', 'data', 'location', 'Locations', 'warehouseFull', undefined, undefined);
//     const dataMenu4c = Component('normal', 'data', 'fixture', 'Fixtures', 'shelves', undefined, undefined);
//     const dataMenu4d = Component('normal', 'data', 'bin', 'Bins', 'cubes', undefined, undefined);
//     const dataMenu4e = Component('normal', 'data', 'item', 'SKUs', 'barcodeRead', undefined, undefined);
//     const dataMenu5b = Component('normal', 'data', 'taxonomy', 'Item Classification', undefined, undefined);
//     const dataMenu5c = Component('normal', 'data', 'verified-brand', 'Brand Mapping', 'rectangleList', undefined, undefined);
//     const dataMenu5a = Component('normal', 'data', 'category', 'Categories', 'diagramNested', undefined, undefined);
//     const dataMenu4 = Component('submenu', 'data', undefined, 'Inventory', 'scannerGun', undefined, undefined);
//     const dataMenu5 = Component('submenu', 'data', undefined, 'Automation', 'binary', undefined, undefined);
//     const dataMenu6 = Component('submenu', 'data', undefined, 'Reports', 'print', undefined, undefined);
//     const dataMenu7 = Component('submenu', 'data', undefined, 'Tasks', 'listCheck', undefined, undefined);
//     const dataMenu8 = Component('submenu', 'fs', undefined, 'FileSystem', 'files', undefined, undefined);
//     const template = [
//         (fileMenu as any)([fileMenu1]),
//         (editMenu as any)([editMenu1, editMenu2, { type: 'separator' }, editMenu3, editMenu4, editMenu5]),
//         (dataMenu as any)([
//             (dataMenu1 as any)([dataMenu1a, dataMenu1b, dataMenu1c, dataMenu1d]),
//             (dataMenu2 as any)([dataMenu2a]),
//             (dataMenu3 as any)([dataMenu3a, dataMenu3b]),
//             (dataMenu4 as any)([dataMenu4a, dataMenu4b, dataMenu4c, dataMenu4d, dataMenu4e]),
//             (dataMenu5 as any)([dataMenu5a, dataMenu5b, dataMenu5c]),
//             dataMenu6,
//             dataMenu7
//         ]),
//         windowMenu,
//         (viewMenu as any)([viewMenu1, viewMenu2, viewMenu3]),
//         helpMenu,
//         aboutMenu
//     ];
// }
