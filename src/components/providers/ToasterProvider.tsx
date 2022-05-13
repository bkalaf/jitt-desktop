import { faBanParking, faBug, faExclamationSquare, faThumbsUp, faTrafficCone, IconDefinition } from '@fortawesome/pro-duotone-svg-icons';
import { createContext } from 'react';
import { useProvideToaster } from '../../hooks/useProvideToaster';
import { IToasterContext } from '../../types/ui/IToasterContext';

export const ToasterContext = createContext<undefined | IToasterContext>(undefined);

export function ToasterProvider({ children }: { children: Children }) {
    const [toasts, addToast, deleteToast] = useProvideToaster();
    return <ToasterContext.Provider value={{ toasts, addToast, deleteToast }}>{children}</ToasterContext.Provider>;
}
