import { Context } from 'react';
import { useToaster } from '../hooks/useToaster';
import { IMetaDataContext, MetaDataContext } from './providers/MetaDataProvider';
import { useProvidedContext } from './providers/OverlayProvider';

export function Toaster() {
    const toasts = useToaster().toasts;
    return <div className='absolute top-0 flex flex-col-reverse w-1/5 h-full space-y-1 pointer-events-none left-2/3'>{toasts()}</div>;
}

export function useMetaDataContext<T extends { _id: Realm.BSON.ObjectId }>() {
    return useProvidedContext<IMetaDataContext<T>>('MetaDataContext', MetaDataContext as any as Context<IMetaDataContext<T>>) as IMetaDataContext<T>;
}


