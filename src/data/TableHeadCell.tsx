import { $cn } from '../util/$cn';

export function TableHeadCell(bg: string) {
    return function ({ label }: { label: string }) {
        const spread = $cn(
            {},
            { [bg]: bg != null },
            'text-lg font-bold leading-loose tracking-wider text-center text-white border border-white divide-white divide font-fira-sans'
        );
        return <th {...spread}>{label}</th>;
    };
}
