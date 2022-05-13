import { toTitleCase } from '../common';
export interface IViewHeaderProps {
    collection: string;
    subtitle: string;
}

export function ViewHeader(props: IViewHeaderProps) {
    const { collection, subtitle } = props;
    return (
        <h1 className='text-lg font-extrabold leading-loose tracking-wide underline font-fira-sans decoration-blue-vert-dark underline-offset-4'>
            {toTitleCase(collection)} - {toTitleCase(subtitle)}
        </h1>
    );
}
