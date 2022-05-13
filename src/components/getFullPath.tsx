import { app } from '@electron/remote';
import path from 'path';

export type SpecialFolder = 'appData' | 'home' | 'userData' | 'desktop' | 'cache' | 'temp' | 'exe' | 'module' | 'documents' | 'videos' | 'pictures' | 'downloads' | 'music' | 'recent' | 'logs' | 'crashDumps';

export function getFullPath(filename: string, pathFolder: SpecialFolder = 'appData', ...folders: string[]) {
    const configPath = app.getPath(pathFolder);
    return [configPath, ...folders, filename].join(path.sep);
}

export function getFullPathMaintenance(filename: string) {
    return getFullPath(filename, 'appData', 'jitt-desktop', 'maintenance');
}
