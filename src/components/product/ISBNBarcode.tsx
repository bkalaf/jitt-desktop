import { UsedBarcode } from '../../data/collections/BarcodeDefinition';

export default function ISBNBarcode({ isbnBarcode }: { isbnBarcode: string }) {
    return <UsedBarcode barcode={isbnBarcode} />;
}
