import { NavMenuItem } from './NavMenuItem';
import { $ } from './../../data/$';
import { NavMenuSection } from './NavMenuSection';
import { MenuItem } from '@electron/remote';
import { useNavigate } from 'react-router-dom';
import { toTitleCase } from '../../common';
import * as Electron from 'electron';

export function NavMenu() {
    const navigate = useNavigate();
    const navTo = (prefix: string) => (to: string) => () => navigate([prefix, to].join(''));

    const navToData = navTo('/data/v1');
    return (
        <ol className='flex flex-col text-white space-y-0.5'>
            {/* <NavMenu.Section label='Storage'>
                <NavMenu.Item prefix='/data/v1' to={$.selfStorage} module='storage' />
                <NavMenu.Item prefix='/data/v1' to={$.facility} module='storage' />
                <NavMenu.Item prefix='/data/v1' to={$.rentalUnit} module='storage' />
                <NavMenu.Item prefix='/data/v1' to={$.purchase} module='storage' />
            </NavMenu.Section> */}
            <NavMenu.Section label='Products'>
                {/* <NavMenu.Item prefix='/data/v1' to={$.company} module='products' />
                <NavMenu.Item prefix='/data/v1' to={$.brand} module='products' />
                <NavMenu.Item prefix='/data/v1' to={$.itemType} module='products' /> */}
                {/* <NavMenu.Item prefix='/data/v1' to={$.productLine} module='products' /> */}
                {/* <NavMenu.Item prefix='/data/v1' to={$.product} module='products' /> */}
            </NavMenu.Section>
            <NavMenu.Section label='Inventory'>
                {/* <NavMenu.Item prefix='/data/v1' to={'barcode'} module='inventory' />
                <NavMenu.Item prefix='/data/v1' to={'bin'} module='inventory' />
                <NavMenu.Item prefix='/data/v1' to={'fixture'} module='inventory' />
                <NavMenu.Item prefix='/data/v1' to='location' module='inventory' />
                <NavMenu.Item prefix='/data/v1' to='photo' module='inventory' />
                <NavMenu.Item prefix='/data/v1' to={'scan'} module='inventory' />
                <NavMenu.Item prefix='/data/v1' to='item' module='inventory' /> */}
            </NavMenu.Section>
            <NavMenu.Section label='listings'>{/* <NavMenu.Item prefix='/data/v1' to='draft' module='listing' /> */}</NavMenu.Section>
            <NavMenu.Section label='Scrapes'>
                {/* <NavMenu.Item prefix='/data/v1' to={$.verifiedBrand} module='scrapes' />
                <NavMenu.Item prefix='/data/v1' to={$.category} module='scrapes' />
                <NavMenu.Item prefix='/data/v1' to={$.taxonomy} module='scrapes' /> */}
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
