import { mongo } from '../data';
import { NavMenuItem } from './NavMenuItem';

export function NavMenu() {
    return (
        <ol className='flex flex-col text-white space-y-0.5'>
            <NavMenuItem to={mongo.selfStorage} />
            <NavMenuItem to={mongo.facility} />
            <NavMenuItem to={mongo.rentalUnit} />
            <NavMenuItem to={mongo.purchase} />
            <NavMenuItem to={mongo.fsAlloc} module='fs' />
            <NavMenuItem to={mongo.fsItem} module='fs' />
        </ol>
    );
}
