import { useCallback, useState } from 'react';
import { eq } from '../common/eq';

export function useArray<T>(initial: T[] = [], comparator: (x: any) => (y: T) => boolean = eq) {
    const [arr, setArray] = useState<T[]>(initial);
    const append = useCallback((item: T) => {
        setArray((prev) => [...prev, item]);
    }, []);
    const remove = useCallback(
        (item: any) => {
            setArray((prev) => [...prev.filter((x) => !comparator(item)(x))]);
        },
        [comparator]
    );
    const contains = useCallback(
        (item: any) => {
            arr.some((x) => comparator(item)(x));
        },
        [arr, comparator]
    );
    const pop = useCallback(() => {
        setArray((prev) => {
            if (prev.length === 0) {
                return prev;
            }
            const [head, ...tail] = prev;
            return [...tail];
        });
    }, []);
    const clear = useCallback(() => setArray([]), []);
    return { arr, append, remove, clear, pop, contains };
}
