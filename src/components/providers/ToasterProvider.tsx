import { faBanParking, faBug, faExclamationSquare, faThumbsUp, faTrafficCone, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { createContext } from 'react';
import { useProvideToaster } from '../../hooks/useProvideToaster';
import { charRange } from '../../common/array/charRange';

export type IToasterContext = {
    toasts: () => JSX.Element[];
    addToast: (type: ToastType) => (body: string, title?: string, subtitle?: string) => void;
    deleteToast: (id: string) => void;
};
export const ToasterContext = createContext<undefined | IToasterContext>(undefined);

export function ToasterProvider({ children }: { children: Children }) {
    const [toasts, addToast, deleteToast] = useProvideToaster();
    return <ToasterContext.Provider value={{ toasts, addToast, deleteToast }}>{children}</ToasterContext.Provider>;
}
export type ToastType = 'info' | 'success' | 'failure' | 'error' | 'warning';
