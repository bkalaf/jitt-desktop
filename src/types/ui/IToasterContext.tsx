import { ToastType } from './ToastType';

export type IToasterContext = {
    toasts: () => JSX.Element[];
    addToast: (type: ToastType) => (body: string, title?: string, subtitle?: string) => void;
    deleteToast: (id: string) => void;
};
