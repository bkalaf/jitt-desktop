import { NavMenuItem } from './NavMenuItem';

export function NavMenu() {
    return (
        <ol className='flex flex-col text-white space-y-0.5'>
            <NavMenuItem to='self-storage' />
            <NavMenuItem to='facility' />
            <NavMenuItem to='rental-unit' />
            <NavMenuItem to='purchase' />
            <NavMenuItem to='file-item' module='fs' />
            <NavMenuItem to='file-data' module='fs' />
        </ol>
    );
}
