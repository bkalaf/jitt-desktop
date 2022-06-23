
export function Grouping({ clusterName, children }: { clusterName?: string; children?: Children; }) {
    return (
        <fieldset className='flex flex-col p-1 bg-transparent border-black border-dashed rounded-lg indent-2 space-y-0.5'>
            <legend className='p-1 mx-2 text-xl font-extrabold leading-loose tracking-wider text-white border border-double rounded-lg indent-2 font-fira-sans bg-rose-dark border-pink'>{clusterName}</legend>
            {children}
        </fieldset>
    );
}
