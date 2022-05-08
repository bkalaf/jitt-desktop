import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ignore } from '../common/ignore';
import { $insertCommand } from '../components/App';
import { useProvideCommand } from './useProvideCommand';

export function useForceUpdate() {
    const [_, setRefresh] = useState(0);
    return useCallback(() => setRefresh((prev) => prev + 1), []);
}
export function useProvideInsertCommand() {
    const navigate = useNavigate();
    const location = useLocation();
    const execute = useCallback(() => {
        navigate([location.pathname, 'new'].join('/'));
    }, [location.pathname, navigate]);
    const [_a, _b, setCommand] = useProvideCommand($insertCommand);
    useEffect(() => {
        console.log('useProvideInsertCommand:useEffect');
        setCommand(execute, location.pathname.replace('/', '').split('v1').slice(1).length > 0);
    }, [execute, location.pathname, setCommand]);
    console.log('command:disabled', location.pathname.replace('/', '').split('v1').slice(1).length > 0);
}
// export function useProvideInsertCommand() {
//     console.group('useProvideInsertCommand');
//     const navigate = useNavigate();
//     const location = useLocation();
//     const execute = useCallback(() => {
//         navigate([location.pathname, 'new'].join('/'));
//     }, [location.pathname, navigate]);
//     console.log('to', [location.pathname, 'new'].join('/'));
//     useEffect(() => {
//         $insertCommand({ isDisabled: false, execute });
//         return () => {
//             $insertCommand({ isDisabled: true, execute: ignore });
//         };
//     }, [execute]);
// }
