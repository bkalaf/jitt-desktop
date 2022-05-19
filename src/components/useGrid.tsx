import { useCallback } from 'react';
import { toTitleCase } from '../common';
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { toOutput } from './providers/DataTypeInfo';
import { useMetaDataContext } from './Toaster';
import { useViewContext } from '../hooks/useViewContext';

export function useGrid<T extends { _id: Realm.BSON.ObjectId }>() {
    return useCallback(function InnerGrid() {
        const [collection] = useRoutedCollection(true);
        const metadata = useMetaDataContext();
        const Headers = metadata.getHeaders(collection);
        const ColGroup = metadata.getColGroup(collection);
        const Row = metadata.getRowComponent(collection);
        useWhyDidYou(InnerGrid.name, {});
        const { data } = useViewContext();
        return (
            <section className='flex flex-col'>
                <table className='w-full h-auto border border-collapse border-white rounded-lg table-auto'>
                    <caption className='text-xl font-extrabold uppercase font-fira-sans tracking-loose'>{toTitleCase(collection)}</caption>
                    {ColGroup}
                    {Headers}
                    <tbody>
                        {(data as Realm.Results<T>)?.map((x, ix) => (
                            <Row key={x._id.toHexString()} rowData={x} />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className='w-full'>
                                <span className='w-full text-center'>{`${(data as Realm.Results<T>).length.toString()} of ${(
                                    data as Realm.Results<T>
                                ).length.toString()}`}</span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div className='flex flex-grow'></div>
            </section>
        );
    }, []);
}
