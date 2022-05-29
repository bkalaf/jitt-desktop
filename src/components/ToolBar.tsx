import { faArrowLeft, faFileInvoiceDollar, faHome, faPlusCircle } from '@fortawesome/pro-duotone-svg-icons';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconLinkButton } from './Buttons/IconLinkButton';
import { $insertCommand } from './App';
import { CommandButton } from './Buttons/CommandButton';
import { useReactiveVar } from '@apollo/client';
import { useSelected } from '../hooks/useSelected';
import { $showFileTools, IconButton } from './MainWindow';
import { useAssignInvoice } from "./useAssignInvoice";
import { useRoutedCollection } from '../hooks/useRoutedCollection';
import { isNotNil } from '../common/isNotNull';

export function ToolBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const goBack = useCallback(() => {
        navigate(location.pathname.split('/').reverse().slice(1).reverse().join('/'));
        // navigate('..');
    }, [location.pathname, navigate]);
    const [collection, id] = useRoutedCollection();
    const showFileTools = useReactiveVar($showFileTools);
    const [isSavingInvoice, saveToInvoice] = useAssignInvoice();
    const selected = useSelected();
    const isSelected = selected.length > 0;
    const navigateNew = useCallback(() => navigate([location.pathname, 'new'].join('/')), [location.pathname, navigate]);
    const enableInsert = useCallback(() => isNotNil(collection) && !isNotNil(id), [collection, id]);
    return (
        <div className='flex w-full px-2 text-lg font-bold leading-loose tracking-wide text-black transition duration-1000 ease-in-out delay-200 border border-white rounded-lg shadow-lg bg-indigo-dark font-fira-sans mb-0.5 justify-center space-x-4'>
            <ul className='flex flex-row justify-center p-1 space-x-1 text-black border border-white rounded-lg bg-slate-dark'>
                <IconLinkButton to='/dashboard' title='Go to your dashboard.' icon={faHome} />
                <IconButton icon={faArrowLeft} title='Go back 1 page.' onClick={goBack} />
                <IconButton icon={faPlusCircle} title='Insert a new record.' onClick={navigateNew} disabled={!enableInsert()} />
                {/* <CommandButton icon={faTrashAlt} title='Delete selected records.' rVar={$deleteCommand} /> */}
            </ul>
            {showFileTools && (
                <ul className='flex flex-row justify-center p-1 space-x-1 text-black border border-white rounded-lg bg-slate-dark'>
                    {isSavingInvoice ? (
                        <span className='inline-flex'>Saving</span>
                    ) : (
                        <IconButton icon={faFileInvoiceDollar} title='Assign to invoice' onClick={saveToInvoice} disabled={!isSelected} />
                    )}
                </ul>
            )}
        </div>
    );
}
