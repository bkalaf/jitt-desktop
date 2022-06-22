import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { $cn } from '../util/$cn';
import { useLeftSidebar } from './Sidebar';
import { NavMenu } from './NavMenu';

export function LeftSidebar() {
    const { appendContents, contents, cycleVisibility, popContents, side, visibility } = useLeftSidebar();
    const props = $cn(
        { style: { maxWidth: '50%' }, onAnimationEnd: cycleVisibility },
        {
            slideInLeft: visibility === 'showing',
            slideOutLeft: visibility === 'hiding',
            flex: visibility !== 'hidden',
            hidden: visibility === 'hidden'
        },
        'h-full resize-x bg-black/80 text-white rounded-r-lg border border-white left-0 top-0 w-1/4'
    );
    const location = useLocation();
    // useEffect(() => {
    //     if (location.pathname.startsWith('/data')) {
    //         appendContents(<NavMenu />);
    //         return () => popContents();
    //     } else {
    //         if (contents.length > 0) {
    //             popContents();
    //         }
    //     }
    // }, [appendContents, contents.length, location.pathname, popContents]);
    return <aside {...props}>{contents}</aside>;
}
