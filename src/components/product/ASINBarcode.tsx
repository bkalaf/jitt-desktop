import { UsedBarcode } from '../../data/collections/BarcodeDefinition';

export default function ASINBarcode({ asinBarcode }: { asinBarcode: string }) {
    return <UsedBarcode barcode={asinBarcode} />;
}
