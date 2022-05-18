import { DAL } from '../components/providers/DAL';


export function useGetDefaultSort(collection: string) {
    return DAL[collection].sorted;
}
