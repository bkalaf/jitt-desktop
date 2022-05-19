import { AuthSegment } from './AuthSegment';
import { TopBarItems } from './TopBarItems';
// eslint-disable-next-line @typescript-eslint/no-var-requires

export function TopBar() {
    return (
        <nav className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-md shadow-md bg-sky-dark font-fira-sans mb-0.5 items-center justify-between'>
            <TopBarItems.Menu.Logo />
            <TopBarItems.Menu.ModuleMenu />
            <AuthSegment />
        </nav>
    );
}

TopBar.Sections = {
    Logo: () => <></>,
    MenuBar: () => <></>,
    Account: () => <></>,
    Auth: () => <></>
};
