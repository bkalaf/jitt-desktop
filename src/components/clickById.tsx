import * as Webdriver from 'webdriverio';
import { $selector } from './MainWindow';


export function clickById(browser: Webdriver.Browser<'async'>) {
    return async function (selector: string) {
        const el = await browser.$($selector.id(selector));
        await el.waitForExist({ timeout: 20000 });
        await el.click();
    };
}
