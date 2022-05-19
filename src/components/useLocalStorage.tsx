import React, { useEffect, useMemo, useState } from 'react';

export function useLocalStorage<T>(
    key: string,
    convert: (x: string | null) => T,
    stringify: (x: T | null) => string
): [T | null, React.Dispatch<React.SetStateAction<T | null>>, string] {
    const [value, updateValue] = useState<T | null>(null);

    useEffect(() => {
        updateValue(convert(localStorage.getItem(key)));
        return () => localStorage.setItem(key, stringify(value));
    }, [convert, key, stringify, value]);

    const output = useMemo(() => stringify(value), [stringify, value]);

    return [value, updateValue, output];
}
