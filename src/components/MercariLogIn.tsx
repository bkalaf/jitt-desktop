import * as Webdriver from 'webdriverio';
import { webdriver } from '../config/webdriver';
import { APP_CONFIG } from '../config';
import { setValue } from './setValue';
import { click } from "../automation/click";

export async function MercariLogIn(browser: Webdriver.Browser<'async'>) {
    await browser.url(webdriver.urls.mercari);
    await click(browser)(webdriver.selectors.logInButton);
    await setValue(browser)(webdriver.selectors.emailInput, APP_CONFIG.credentials.mercari.username);
    await setValue(browser)(webdriver.selectors.passwordInput, APP_CONFIG.credentials.mercari.password);
    await click(browser)(webdriver.selectors.logInSubmitButton);
    await click(browser)(webdriver.selectors.CTA);
}
