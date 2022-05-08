import { useToaster } from './useToaster';

export function useDeleteToast() {
    return useToaster().deleteToast;
}
