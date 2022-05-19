import * as Webdriver from 'webdriverio';
import { $selector } from '../components/MainWindow';

export function click(browser: Webdriver.Browser<'async'>) {
    return async function (selector: [string, string]) {
        const el = await browser.$($selector.data(selector));
        await el.waitForClickable({ timeout: 20000 });
        await el.click();
    };
}
