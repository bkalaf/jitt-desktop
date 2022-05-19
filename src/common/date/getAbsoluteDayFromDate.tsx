import { caldays } from '../../components/useActivity';

export function getAbsoluteDayFromDate(d: Date) {
    const month = d.getUTCMonth() + 1;
    const date = d.getUTCDate();
    const days = caldays[month - 1];
    return days + date;
}
