import { UsedBarcode } from '../../data/collections/BarcodeDefinition';

export default function UPCBarcode({ upcBarcode }: { upcBarcode: string }) {
    return <UsedBarcode barcode={upcBarcode} />;
}
