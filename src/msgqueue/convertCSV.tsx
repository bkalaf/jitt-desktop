import { appSettings } from '../settings';
import { runCmd } from './cli';


export function convertCSV() {
    return runCmd('ssconvert', appSettings.files.printLabelsCSV, appSettings.files.printLabelsXLSX);
}
