import React from 'react';
import { Link } from 'react-router-dom';
import { useWhyDidYou } from '../hooks/useWhyDidYou';
import { $cn } from './$cn';
import { isLower } from './isLower';
import { NavLinkListItem } from "./NavLinkListItem";
import { TopBarItems } from './TopBarItems';
// eslint-disable-next-line @typescript-eslint/no-var-requires

export function LinkButton({ children, to }: { children: Children; to: string }) {
    return (
        <Link to={to} className='flex'>
            {children}
        </Link>
    );
}
export function isUpper(s: string) {
    return s.toUpperCase() === s && s.toLowerCase() !== s;
}
export function isSnakeCase(str: string) {
    return str.includes('_') && str.split('').every((x) => !isUpper(x));
}
export function isPascalCase(str: string) {
    return !str.includes('-') && !str.includes('_') && !str.includes(' ') && str.split('').some(isLower) && isUpper(str[0]);
}
export function isTitleCase(str: string) {
    return str.includes(' ') || (!str.includes('-') && !str.includes('_') && isUpper(str[0]));
}
export function TopBar() {
    return (
        <nav className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-white transition duration-1000 ease-in-out delay-200 border border-white rounded-md shadow-md bg-sky-dark font-fira-sans mb-0.5 items-center justify-between'>
            <TopBarItems.Menu.Logo />
            <ol className='flex flex-row p-3'>
                <TopBarItems.Menu.RootItems />
            </ol>
            <ButtonGroup>
                <NavLinkListItem className='px-3 nav-button auth-button' to='login' index={0}>
                    Log-In
                </NavLinkListItem>
                <li>
                    <Button className='px-3 nav-button auth-button'>Register</Button>
                </li>
                <li>
                    <Button className='px-3 py-3 nav-button auth-button'>Log-Out</Button>
                </li>
            </ButtonGroup>
        </nav>
    );
}

export function ButtonGroup(props: { children: Children }) {
    useWhyDidYou(ButtonGroup.name, props);
    const { children, ...spread } = $cn(props, {}, 'flex flex-row p-3');
    return <ol {...spread}>{children}</ol>;
}

export function Button(props: { children?: Children } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    useWhyDidYou(Button.name, props);
    const spread = $cn(props, {}, 'nav-button');
    return <button type='button' {...spread}></button>;
}

export function ButtonListItem(props: { ix: number }) {
    useWhyDidYou(ButtonListItem.name, props);
    const { ix, ...spread } = $cn(props, {}, 'px-3 nav-button auth-button py-1.5');
    return <li key={ix} className='flex'>
        <Button {...spread}></Button>
    </li>
}