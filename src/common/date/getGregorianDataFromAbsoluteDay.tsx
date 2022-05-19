import { caldays } from '../../components/useActivity';

export function getGregorianDataFromAbsoluteDay(n: number, year = '2022') {
    const mon =
        Math.max(
            ...Object.entries(caldays)
                .filter(([k, v]) => v <= n)
                .map((x) => parseInt(x[0], 10))
        ) + 1;
    const month = n <= 31 ? 1 : mon;
    const day = month === 1 && n <= 31 ? n : n - caldays[month - 1];
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}
