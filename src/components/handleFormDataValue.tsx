import { toString } from '../common/toString';

export function handleFormDataValue(func: (s: string) => any) {
    return async function (fdv: FormDataEntryValue) {
        if (typeof fdv === 'string') {
            return func(fdv);
        }
        const buffer = await fdv.arrayBuffer();
        return buffer;
    };
}
