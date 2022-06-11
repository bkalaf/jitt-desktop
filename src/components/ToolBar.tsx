import {
    faArrowLeft,
    faBarcodeRead,
    faBarcodeScan,
    faCamera,
    faFileInvoiceDollar,
    faHome,
    faPlusCircle,
    faPrint,
    faTags
} from '@fortawesome/pro-duotone-svg-icons';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconLinkButton } from './Buttons/IconLinkButton';
import { $insertCommand } from './App';
import { CommandButton } from './Buttons/CommandButton';
import { useReactiveVar } from '@apollo/client';
import { useSelected } from '../hooks/useSelected';
import { $showFileTools, ToolbarDuotoneButton } from './MainWindow';
import { IconButton } from './IconButton';
import { useAssignInvoice } from './useAssignInvoice';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { isNotNil } from '../common/isNotNull';
import { clipboard, dialog } from '@electron/remote';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { Inventory, Pipelines } from '../data';
import { appSettings } from '../settings';
import { calculateFullBarcodeWithCheckDigit } from '../data/definitions/checkDigit';
import { useDebouncedCallback, useThrottleCallback } from '../data/ModernGrid';
import { useEventListener } from '../hooks/useEventListener';
import { ipcRenderer } from 'electron';

export function ToolBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const goBack = useCallback(() => {
        navigate(location.pathname.split('/').reverse().slice(1).reverse().join('/'));
        // navigate('..');
    }, [location.pathname, navigate]);
    const [collection, id] = useRoutedCollection();
    const showFileTools = useReactiveVar($showFileTools);
    const [isSavingInvoice, saveToInvoice] = useAssignInvoice();
    const selected = useSelected();
    const isSelected = selected.length > 0;
    const navigateNew = useCallback(
        () => navigate([location.pathname, 'new'].join('/'), { state: location.search }),
        [location.pathname, location.search, navigate]
    );
    const enableInsert = useCallback(() => isNotNil(collection) && !isNotNil(id), [collection, id]);
    const enableAssignBarcode = useCallback(
        () => ['fixture', 'bin', 'product', 'item'].includes(collection) && selected.length === 1,
        [collection, selected.length]
    );
    const assignBarcode = useCallback(() => {
        const item = selected[0];
        const el = document.querySelector(`tr[data-oid='${item}']`) as HTMLElement | null;
        if (el == null) throw new Error(`bad id: ${id}`);
        navigate([location.pathname, el.dataset.oid, 'assign'].join('/'), { state: el.dataset.oid });
    }, [id, location.pathname, navigate, selected]);
    const enableAddToPrint = useCallback(() => {
        return ['barcode'].includes(collection) && selected.length > 0;
    }, [collection, selected.length]);
    const realm = useLocalRealm();
    const addSingleToPrint = useCallback((bc: IBarcode) => {
        console.log('barcode', bc);
        console.log('fixtures', bc.fixture);
        console.log('bins', bc.bin);
        const type = (bc.fixture?.length ?? 0) > 0 ? 'fixture' : (bc.bin?.length ?? 0) > 0 ? 'bin' : undefined;
        const name = type === 'fixture' ? (bc.fixture ?? [])[0]!.name : (bc.bin ?? [])[0]!.name;
        const notes = type === 'fixture' ? (bc.fixture ?? [])[0]!.notes : (bc.bin ?? [])[0]!.notes;
        const barcode = bc.barcode;
        const description = bc.description;
        console.log(`sending: add-to-tag-queue`, barcode);
        ipcRenderer.send('add-to-tag-queue', name, barcode, description, type, notes);
    }, []);
    const addToPrint = useCallback(() => {
        const selectedBarcodes = (selected.map((oid) => realm.objectForPrimaryKey<IBarcode>('barcode', new Realm.BSON.ObjectId(oid))) ?? []).filter(
            isNotNil
        ) as any as Array<Realm.Object & IBarcode>;
        selectedBarcodes.forEach(addSingleToPrint);
    }, [addSingleToPrint, realm, selected]);
    const enableConsumeBarcode = useCallback(() => {
        return document.activeElement?.tagName === 'INPUT';
    }, []);
    const consumeBarcodeInventoryControl = useCallback(() => {
        console.log('consuming');
        const current = localStorage.getItem('barcode::inventory-control::next') ?? appSettings.skus.inventory;
        const next = (parseInt(current, 10) + 1).toFixed(0);
        localStorage.setItem('barcode::inventory-control::next', next);
        console.log('next', next);
        const nextComplete = calculateFullBarcodeWithCheckDigit(next);
        console.log('nextComplete', nextComplete);
        const _id = new Realm.BSON.ObjectId();
        realm.write(() => {
            realm.create('barcode', { _id, type: 'UPCE', valid: true, barcode: nextComplete });
        });

        (document.querySelector(`#assign-barcode-input`) as HTMLInputElement).value = nextComplete;
    }, [realm]);
    const consumeBarcodeItem = useCallback(() => {
        const current = localStorage.getItem('barcode::items::next') ?? appSettings.skus.inventory;
        const next = (parseInt(current, 10) + 1).toFixed(0);
        localStorage.setItem('barcode::items::next', next);
        const nextComplete = calculateFullBarcodeWithCheckDigit(next);
        const _id = new Realm.BSON.ObjectId();
        realm.write(() => {
            realm.create('barcode', { _id, type: 'UPC-E', valid: true, barcode: nextComplete });
        });
        (document.activeElement as HTMLInputElement).value = clipboard.readText();
    }, [realm]);
    const printTags = useCallback(() => {
        ipcRenderer.send('consume-tags');
    }, []);
    const [enableConsume, setEnableConsume] = useState(false);
    const _onMouseMove: (ev: MouseEvent) => void = useCallback((ev: MouseEvent) => {
        setEnableConsume((prev: any) => {
            return document.activeElement?.tagName === 'INPUT';
        });
    }, []);
    const onMouseMove = useThrottleCallback(_onMouseMove, 500);
    const navigateToPhotoUpload = useCallback(() => {
        navigate('/data/v1/photo/new');
    }, [navigate]);
    useEventListener('mousemove', onMouseMove, document);
    return (
        <div className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-black transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-indigo-dark font-fira-sans mb-0.5 justify-center space-x-4'>
            <ul className='flex flex-row justify-center p-1 space-x-1 text-black border border-white rounded-lg bg-slate-dark'>
                <IconLinkButton to='/dashboard' title='Go to your dashboard.' icon={faHome} />
                <IconButton icon={faArrowLeft} title='Go back 1 page.' onClick={goBack} />
                <IconButton icon={faPlusCircle} title='Insert a new record.' onClick={navigateNew} disabled={!enableInsert()} />
                {/* <CommandButton icon={faTrashAlt} title='Delete selected records.' rVar={$deleteCommand} /> */}
                <ToolbarDuotoneButton
                    icon={faBarcodeRead}
                    title='Assign barcode to selected row.'
                    onClick={assignBarcode}
                    disabled={!enableAssignBarcode()}
                    primary='darkslategray'
                    secondary='red'
                    primaryOpacity={1}
                    size='2x'
                />
                <ToolbarDuotoneButton
                    icon={faCamera}
                    title='Upload a photo batch'
                    onClick={navigateToPhotoUpload}
                    disabled={false}
                    primary='black'
                    secondary='linen'
                    size='2x'
                />
                <ToolbarDuotoneButton
                    icon={faPrint}
                    primary='mediumaquamarine'
                    secondary='turquoise'
                    size='2x'
                    onClick={addToPrint}
                    disabled={!enableAddToPrint()}
                    title='Add selected rows to the label printer queue.'
                />
                <ToolbarDuotoneButton
                    icon={faBarcodeScan}
                    title='Generate the next barcode for inventory control purposes.'
                    primary='darkmagenta'
                    secondary='crimson'
                    size='2x'
                    disabled={!enableConsumeBarcode()}
                    onClick={consumeBarcodeInventoryControl}
                />
                <ToolbarDuotoneButton icon={faTags} title='Print tags' primary='red' secondary='blue' size='2x' disabled={false} onClick={printTags} />
            </ul>
            {showFileTools && (
                <ul className='flex flex-row justify-center p-1 space-x-1 text-black border border-white rounded-lg bg-slate-dark'>
                    {isSavingInvoice ? (
                        <span className='inline-flex'>Saving</span>
                    ) : (
                        <IconButton icon={faFileInvoiceDollar} title='Assign to invoice' onClick={saveToInvoice} disabled={!isSelected} />
                    )}
                </ul>
            )}
        </div>
    );
}
