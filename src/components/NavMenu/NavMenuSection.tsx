export function NavMenuSection(props: { children: Children; label: string }) {
    return (
        <li key={props.label} className='flex flex-row'>
            <div className='flex text-sm font-semibold text-white uppercase text-upright font-fira-sans indent-2 bg-blue-dark'>{props.label}</div>
            <ol className='flex flex-col flex-grow'>{props.children}</ol>
        </li>
    );
}
