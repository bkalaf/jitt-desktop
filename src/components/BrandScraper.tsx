import { useEffect } from 'react';
import React from 'react';
import * as Webdriver from 'webdriverio';
import { DataOrModifiedFn } from 'use-async-resource';
import { webdriver } from '../config/webdriver';
import { useLog } from './providers/buildLibrary';
import { writeBrands, startBrands, finishBrands } from './MainWindow';
import { MercariLogIn } from "./MercariLogIn";

export function BrandScraper({ reader }: { reader: DataOrModifiedFn<Webdriver.Browser<'async'>> }) {
    const browser = reader();
    const log = useLog();
    useEffect(() => {
        async function run() {
            async function inner([x1, x2, x3]: [string, string, string]) {
                // await browser.$('[data-testid="Brand"]').waitForEnabled({
                //     timeout: 5000
                // });
                if (x1 != null) {
                    await browser.$('[data-testid="Brand"]').clearValue();
                    await browser.$('[data-testid="Brand"]').click();
                    await browser.keys([x1]);
                    await browser.keys([x2]);
                    await browser.keys([x3]);
                    // await browser.keys([x4]);
                    await browser.pause(500);
                    const result = await browser.$('[data-testid="BrandDropdown"]');
                    const result1 = await result.$$('div > span');
                    const result2 = result1.map(async (x) => await x.$$('span > span'));
                    const result3 = await Promise.all(result2);
                    const result4 = await Promise.all(result3.map(async (x) => await Promise.all(x.map(async (y) => await y.getText()))));
                    // const result5 = await Promise.all(result4.map(async (x) => await Promise.all(x)));
                    console.log('result4', result4);
                    const final = result4.map((x) => x.join(''));
                    // console.log('result5', result5);
                    console.log('final', final);
                    writeBrands(`${x1}${x2}${x3}\n`, final);
                }
            }
            console.log('starting');
            await browser.url(webdriver.urls.mercari);
            // await browser.pause(1000);
            // await browser.keys(['Control', 'Shift', 'I']);
            // await browser.pause(1000);
            // await browser.keys(['Control', 'Shift', 'P']);
            // await browser.pause(1000);
            // await browser.keys(['e', 'm', 'f', 'o', 'ArrowDown', 'ArrowDown', 'Enter']);
            // await browser.pause(1000);
            await MercariLogIn(browser);
            const seqs = startBrands(log);
            await browser.pause(10000);

            // const seqs = [['r', 'o', 'o', 'm'], ['a', 'b', 'e', 'r'], ['t', 'a', 'r', 'g'],['a', 'b', 'b', 'i'],  ['a', 'b', 'b', ' ']] as [string, string, string, string][];
            await seqs.reduce((pv, cv) => pv.then((x) => inner(cv)), Promise.resolve());

            // console.log(`result`, await result.getHTML())
            // console.log(`result1`, result1);
            // console.log(`result2`, result2);
            // console.log(`result3`, result3);
            // console.log(`result4`, result4);
            // console.log(`result5`, result5);
            // .map(async y => await y.getText()));
            // console.log(result.map(x => x.join('')).join('\n'));
            // .$$('div > div')
            //     .map(async (el) => {
            //         return await el.$$('span > span').map(async (x) => {
            //             return await x.getText();
            //         });
            //     });
            // process.stdout.write(`${result.map((x) => `${x.join('')}\n`).join('')}]\n`);
            finishBrands(log);
            return;
        }
        run();
    }, [browser, log]);
    return <></>;
}
