import * as Webdriver from 'webdriverio';
import { $selector } from '../components/MainWindow';

export function getValue(browser: Webdriver.Browser<'async'>) {
    return async function (selector: [string, string]) {
        const el = await browser.$($selector.data(selector));
        await el.waitForEnabled({ timeout: 20000 });
        return await el.getValue();
    };
}
