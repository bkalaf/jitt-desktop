import { NavMenuItem } from './NavMenuItem';

export function NavMenu() {
    return (
        <div className='flex flex-col text-white'>
            <NavMenuItem to='self-storage' />
            <NavMenuItem to='facility' />
            <NavMenuItem to='rental-unit' />
            <NavMenuItem to='purchase' />
            <NavMenuItem to='file-item' />
            <NavMenuItem to='file-data' />
        </div>
    );
}
