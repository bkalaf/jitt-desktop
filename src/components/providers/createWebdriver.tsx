import * as Webdriver from 'webdriverio';

export function createWebdriver() {
    return Webdriver.remote({
        logLevel: 'warn',
        headless: true,
        capabilities: {
            browserName: 'chrome'
        }
    });
}
