import { process as electronProcess } from '@electron/remote';
import { useCallback } from 'react';

export function useLog() {
    // const logFile = useMemo(() => getFullPath('jitt.log', 'logs', 'jitt-desktop'), []);
    const log = useCallback((name: any, ...args: string[]) => {
        const line = [typeof name !== 'string' ? JSON.stringify(name) : name, ...args].join(' :: ').concat('\n');
        // fs.appendFileSync(logFile, line);
        electronProcess.stdout.write(line);
        console.log(name, ...args);
    }, []);
    return log;
}
