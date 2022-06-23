import { BrowserWindow, MenuItem } from 'electron';
import { createContext } from 'react';
import { leaf } from '.';
import { useToggle } from '../hooks/useToggle';
import { makeVar } from '@apollo/client';

export type QueueState = [isRunning: boolean, isPaused: boolean];
export const $queues = makeVar({
    skuPrinter: [false, false] as QueueState
});
const template = [
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

                submenu: [leaf('self-storage'), leaf('facility'), leaf('rental-unit'), leaf('purchase')]
            },
            {
                type: 'submenu',
                label: 'Inventory',
                submenu: [leaf('barcode'), leaf('location'), leaf('fixture'), leaf('bin'), leaf('item')]
            },
            {
                type: 'submenu',
                label: 'Products',
                submenu: [leaf('item-type'), leaf('company'), leaf('brand'), leaf('product-line'), leaf('product')]
            },
            {
                type: 'submenu',
                label: 'Files',
                submenu: [leaf('photo'), leaf('product-documentation')]
            },
            {
                type: 'submenu',
                label: 'Scrapes',
                submenu: [leaf('category'), leaf('taxonomy'), leaf('verified-brand'), leaf('custom-item'), leaf('custom-item-entry')]
            }
        ]
    },
    {
        type: 'submenu',
        label: 'Queues',
        submenu: [
            {
                type: 'submenu',
                label: 'SKU Printer',
                submenu: [
                    {
                        type: 'normal',
                        label: 'Export Tags',
                        click: function (_menuItem: MenuItem, _browser: BrowserWindow, ev: Event) {
                            
                        }
                    }
                ]
            }
        ]
    },
    { type: 'submenu', label: 'Actions', submenu: [{ type: 'normal', label: '' }] },
    {
        type: 'submenu',
        label: 'Tags',
        submenu: [
            { type: 'normal', label: 'Increment-Inventory', click: navTo('api', 'v1', 'new-inventory-tag') },
            { type: 'normal', label: 'Increment-Item', click: navTo('api', 'v1', 'new-item-tag') },
            { type: 'separator' },
            { type: 'normal', label: 'Print Tags', click: navTo('api', 'v1', 'print-tags') }
        ]
    },
    { type: 'submenu', role: 'windowMenu', submenu: [] },
    { type: 'normal', label: 'Help', role: 'help', click: ignore },
    { type: 'normal', label: 'About', role: 'about', click: ignore }
] as any[];
