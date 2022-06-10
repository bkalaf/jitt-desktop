import { FilterTuple, OpSymbol } from './components/MainRouter';

const file = [__dirname, 'appSettings.json'].join('/');
console.log(file);

export type MenuItemRole =
    | 'undo'
    | 'redo'
    | 'cut'
    | 'copy'
    | 'paste'
    | 'pasteAndMatchStyle'
    | 'delete'
    | 'selectAll'
    | 'reload'
    | 'forceReload'
    | 'toggleDevTools'
    | 'resetZoom'
    | 'zoomIn'
    | 'zoomOut'
    | 'toggleSpellChecker'
    | 'togglefullscreen'
    | 'window'
    | 'minimize'
    | 'close'
    | 'help'
    | 'about'
    | 'services'
    | 'hide'
    | 'hideOthers'
    | 'unhide'
    | 'quit'
    | 'showSubstitutions'
    | 'toggleSmartQuotes'
    | 'toggleSmartDashes'
    | 'toggleTextReplacement'
    | 'startSpeaking'
    | 'stopSpeaking'
    | 'zoom'
    | 'front'
    | 'appMenu'
    | 'fileMenu'
    | 'editMenu'
    | 'viewMenu'
    | 'shareMenu'
    | 'recentDocuments'
    | 'toggleTabBar'
    | 'selectNextTab'
    | 'selectPreviousTab'
    | 'mergeAllWindows'
    | 'clearRecentDocuments'
    | 'moveTabToNewWindow'
    | 'windowMenu';

export const $$barcodeCSV = [__dirname, 'barcode.csv'].join('/');
export const $$barcodeXLS = [__dirname, 'barcode.xlsx'].join('/');
export const appSettings = {
    files: {
        printLabelsCSV: $$barcodeCSV,
        printLabelsXLSX: $$barcodeXLS
    },
    credentials: {
        mercari: ['bobby.kalaf.jr@gmail.com', 'Achilles@92111']
    },
    skus: {
        inventory: '49999950000',
        items: '40000100000'
    },
    grid: {
        header: {
            cell: {
                contextMenu:
                    (
                        toggleSort: (s: string) => void,
                        sortDirection: (x: string) => 'ASC' | 'DESC' | null,
                        filters: (x: string) => (x: OpSymbol, pred?: (x: any) => boolean) => boolean
                    ) =>
                    (columnName: string) =>
                        [
                            {
                                label: 'sort',
                                submenu: [
                                    { label: 'A -> Z', type: 'radio', checked: sortDirection(columnName) === 'DESC', click: () => toggleSort(columnName) },
                                    { label: 'Z -> A', type: 'radio', checked: sortDirection(columnName) === 'ASC', click: () => toggleSort(columnName) }
                                ]
                            },
                            {
                                label: 'filter',
                                submenu: [
                                    { label: 'equal', type: 'checkbox', checked: filters(columnName)('eq', (x) => typeof x !== 'boolean') },
                                    { label: 'does-not-equal', type: 'checkbox', checked: filters(columnName)('dne', (x) => typeof x !== 'boolean') },
                                    { label: 'greater-than', type: 'checkbox', checked: filters(columnName)('gt') },
                                    { label: 'less-than', type: 'checkbox', checked: filters(columnName)('lt') },
                                    { label: 'contains', type: 'checkbox', checked: filters(columnName)('incl') },
                                    { label: 'is true', type: 'checkbox', checked: filters(columnName)('eq', (x) => x === true) },
                                    { label: 'is false', type: 'checkbox', checked: filters(columnName)('eq', (x) => x === false) },
                                    { label: 'is null', type: 'checkbox', checked: filters(columnName)('eq', (x) => x == null) }
                                ]
                            }
                        ]
            }
        }
    },
    menu: {
        file: {
            close: { role: 'close' },
            quit: { role: 'quit' }
        },
        edit: [
            '&Edit',
            {
                undo: { role: 'undo' },
                redo: { role: 'redo' },
                sep1: { type: 'separator' },
                cut: { role: 'cut' },
                copy: { role: 'copy' },
                paste: { role: 'paste' },
                pasteAndMatchStyle: { role: 'pasteAndMatchStyle' }
            }
        ],
        go: {
            data: {
                auctions: {
                    selfStorage: 0,
                    facility: 0,
                    rentalUnit: 0,
                    purchase: 0
                },
                inventory: {
                    barcode: 0,
                    bin: 0,
                    fixture: 0,
                    scan: 1
                },
                products: {
                    company: 0,
                    brand: 0,
                    productLine: 1,
                    itemType: 0,
                    product: 1
                    // composition: 1,
                    // dimensions: 1,
                    // measurements: 1
                },
                details: {
                    detail: 1,
                    media: 1,
                    book: 1,
                    dvd: 1,
                    vhs: 1,
                    cd: 1,
                    videoGame: 1,
                    apparel: 1,
                    shoes: 1,
                    toys: 1,
                    cookware: 1,
                    appliance: 1,
                    electronic: 1,
                    computer: 1,
                    printer: 1,
                    sportingGood: 1,
                    golfClub: 1,
                    bedding: 1,
                    linen: 1,
                    collectible: 1,
                    jewelry: 1,
                    cellPhone: 1,
                    beauty: 1,
                    stuffedAnimal: 1,
                    smartHome: 1,
                    tool: 1,
                    cable: 1
                },
                files: {
                    fsAlloc: 0,
                    fsItem: 0,
                    imageVersion: 1,
                    photo: 1
                },
                listings: {
                    draft: 1,
                    listing: 1,
                    price: 1,
                    sale: 1
                },
                fulfillment: {
                    rate: 1,
                    package: 1,
                    tracking: 1,
                    payout: 1
                },
                scrapes: {
                    category: 0,
                    taxonomy: 0,
                    verifiedBrand: 0
                }
            },
            dataflow: {
                files: {},
                photos: {},
                items: {},
                listings: {},
                prices: {}
            }
        },
        run: {},
        reports: {},
        view: {},
        window: {
            reload: { role: 'reload' },
            sep1: { type: 'separator ' },
            minimize: { role: 'minimize' },
            fullscreen: { role: 'toggleFullscreen' },
            close: { role: 'close' }
        },
        help: {}
    }
};
