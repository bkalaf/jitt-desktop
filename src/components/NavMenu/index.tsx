import { NavMenuItem } from './NavMenuItem';
import { $ } from './../../data/$';
import { NavMenuSection } from './NavMenuSection';

export function NavMenu() {
    return (
        <ol className='flex flex-col text-white space-y-0.5'>
            <NavMenu.Section label='Storage'>
                <NavMenu.Item prefix='/data/v1' to={$.selfStorage} module='storage' />
                <NavMenu.Item prefix='/data/v1' to={$.facility} module='storage' />
                <NavMenu.Item prefix='/data/v1' to={$.rentalUnit} module='storage' />
                <NavMenu.Item prefix='/data/v1' to={$.purchase} module='storage' />
            </NavMenu.Section>
            {/* <NavMenu.Section label='Auctions'></NavMenu.Section> */}
            <NavMenu.Section label='Products'>
                <NavMenu.Item prefix='/data/v1' to={$.company} module='products' />
                <NavMenu.Item prefix='/data/v1' to={$.brand} module='products' />
                <NavMenu.Item prefix='/data/v1' to={$.itemType} module='products' />
                <NavMenu.Item prefix='/data/v1' to={$.productLine} module='products' />
            </NavMenu.Section>
            <NavMenu.Section label='Inventory'>
                <NavMenu.Item prefix='/data/v1' to={'barcode'} module='inventory' />
                <NavMenu.Item prefix='/data/v1' to={'bin'} module='inventory' />
                <NavMenu.Item prefix='/data/v1' to={'fixture'} module='inventory' />
                <NavMenu.Item prefix='/data/v1' to='photo' module='inventory' />
                <NavMenu.Item prefix='/data/v1' to={'scan'} module='inventory' />
            </NavMenu.Section>
            <NavMenu.Section label='Scrapes'>
                <NavMenu.Item prefix='/data/v1' to={$.verifiedBrand} module='scrapes' />
                <NavMenu.Item prefix='/data/v1' to={$.category} module='scrapes' />
                <NavMenu.Item prefix='/data/v1' to={$.taxonomy} module='scrapes' />
            </NavMenu.Section>
            <NavMenu.Section label='Files'>
                <NavMenu.Item prefix='/fs/v1' to={$.fsAlloc} module='fs' />
                <NavMenu.Item prefix='/fs/v1' to={$.fsItem} module='fs' />
            </NavMenu.Section>
        </ol>
    );
}

NavMenu.Item = NavMenuItem;
NavMenu.Section = NavMenuSection;
