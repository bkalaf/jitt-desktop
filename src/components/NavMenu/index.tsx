import { mongo } from '../../data';
import { NavMenuItem } from './NavMenuItem';

export function NavMenu() {
    return (
        <ol className='flex flex-col text-white space-y-0.5'>
            <NavMenu.Item to={mongo.selfStorage} />
            <NavMenu.Item to={mongo.facility} />
            <NavMenu.Item to={mongo.rentalUnit} />
            <NavMenu.Item to={mongo.purchase} />
            <NavMenu.Item to={mongo.company} />
            <NavMenu.Item to={mongo.brand} />
            <NavMenu.Item to={mongo.verifiedBrand} />
            <NavMenu.Item to={mongo.category} />
            <NavMenu.Item to={mongo.taxonomy} />
            <NavMenu.Item to={mongo.itemtype} />

            <NavMenu.Item to={mongo.fsAlloc} module='fs' />
            <NavMenu.Item to={mongo.fsItem} module='fs' />
        </ol>
    );
}
NavMenu.Item = NavMenuItem;
