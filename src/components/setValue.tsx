import * as Webdriver from 'webdriverio';
import { $selector } from './MainWindow';
import { getValue } from "../automation/getValue";

export function setValue(browser: Webdriver.Browser<'async'>) {
    return async function (selector: [string, string], value: string) {
        const el = await browser.$($selector.data(selector));
        await el.waitForEnabled({ timeout: 20000 });
        await el.setValue(value);
        await browser.waitUntil(async () => {
            return (await getValue(browser)(selector)) === value;
        });
    };
}
