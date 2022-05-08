import { useCallback, useMemo, useState } from 'react';
import { fst } from '../common/fst';
import { generateRandomString } from '../common/generateRandomString';
import { snd } from '../common/snd';
import { toastTypeMap, Toast } from '../components/Toast';
import { ToastType } from '../components/providers/ToasterProvider';

export function useProvideToaster(): [
    () => JSX.Element[],
    (type: ToastType) => (body: string, title?: string, subtitle?: string) => void,
    (id: string) => void
] {
    const [map, setMap] = useState<[string, JSX.Element][]>([]);
    const toasts = useCallback(() => map.map(snd), [map]);
    const append = useCallback((item: JSX.Element) => {
        setMap((prev) => [...prev, [item.props.id, item]]);
    }, []);
    const remove = useCallback((id: string) => {
        setMap((prev) => [...prev.filter((x) => fst(x) !== id)]);
    }, []);

    const addToast = useCallback(
        (type: ToastType) => {
            return function (body: string, title?: string, subtitle?: string) {
                const [icon, bgDark, bg, bgLight, titleDefault] = toastTypeMap[type];
                const id = generateRandomString(24);
                const el = (
                    <Toast
                        id={id}
                        key={id}
                        icon={icon}
                        bg={bg}
                        bgLight={bgLight}
                        bgDark={bgDark}
                        subtitle={subtitle}
                        body={body}
                        title={title ?? titleDefault}
                    />
                );
                append(el);
            };
        },
        [append]
    );
    return [toasts, addToast, remove];
}
