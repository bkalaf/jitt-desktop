export function NavMenuSection(props: { children: Children; label: string }) {
    return (
        <li className='flex flex-row'>
            <div className='flex text-sm font-semibold text-white text-upright font-fira-sans bg-blue-dark'>{props.label}</div>
            <ol className='flex flex-col flex-grow'>{props.children}</ol>
        </li>
    );
}
