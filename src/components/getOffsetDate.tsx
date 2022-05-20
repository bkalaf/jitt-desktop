import { getAbsoluteDayFromDate } from '../common/date/getAbsoluteDayFromDate';
import { getGregorianDataFromAbsoluteDay } from '../common/date/getGregorianDataFromAbsoluteDay';
import { now } from '../aggregator';



export function getOffsetDate(qty: number, from = now()) {
    const to = new Date(Date.parse(getGregorianDataFromAbsoluteDay(getAbsoluteDayFromDate(from) + qty)));
    to.setHours(from.getHours());
    to.setMinutes(from.getMinutes());
    to.setSeconds(from.getSeconds());
    return to;
}
