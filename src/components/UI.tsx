import { createPortal } from 'react-dom';
import { OverlayProvider } from './providers/OverlayProvider';
import { ToasterProvider } from './providers/ToasterProvider';
import { LeftSidebarProvider, RightSidebarProvider } from './Sidebar';

export function UI({ children }: { children: Children }) {
    const container = document.getElementById('modal-root')!;
    return (
        <ToasterProvider>
            <RightSidebarProvider>
                <LeftSidebarProvider>
                    {/* <OverlayProvider> */}
                    {children}
                    {/* {createPortal(<Overlay />, container)} */}
                    {/* </OverlayProvider> */}
                </LeftSidebarProvider>
            </RightSidebarProvider>
        </ToasterProvider>
    );
}
