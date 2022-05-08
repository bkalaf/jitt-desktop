import { useToaster } from '../hooks/useToaster';

export function Toaster() {
    const toasts = useToaster().toasts;
    return <div className='absolute top-0 flex flex-col-reverse w-1/5 h-full space-y-1 pointer-events-none left-2/3'>{toasts()}</div>;
}
