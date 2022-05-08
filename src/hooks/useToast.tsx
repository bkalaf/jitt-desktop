import { useMemo } from 'react';
import { ToastType } from '../components/providers/ToasterProvider';
import { useToaster } from './useToaster';

export function useToast(type: ToastType) {
    const { addToast } = useToaster();
    return useMemo(() => addToast(type), [addToast, type]);
}
