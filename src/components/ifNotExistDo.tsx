import * as Webdriver from 'webdriverio';
import { $selector } from './MainWindow';
import { click } from "../automation/click";

export function ifNotExistDo(browser: Webdriver.Browser<'async'>, log: any) {
    return async function (existSelector: string, clickSelector: [string, string]) {
        const el = await browser.$($selector.id(existSelector));
        if (!(await el.isExisting())) {
            log(`not existsing: ${existSelector} clicking: ${clickSelector}`);
            await click(browser)(clickSelector);
        }
    };
}
