import { useCallback } from 'react';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { useChangeFileParent } from "./useChangeFileParent";

export function useAssignInvoice(): [boolean, () => void] {
    const realm = useLocalRealm();
    const [isLoading, moveFile] = useChangeFileParent();
    const execute = useCallback(() => moveFile('/auctions/invoices'), [moveFile]);
    return [isLoading, execute];
}
