import { useEffect } from 'react';
import React from 'react';
import * as Webdriver from 'webdriverio';
import { DataOrModifiedFn } from 'use-async-resource';
import { webdriver } from '../../config/webdriver';
import { files } from '../../config';
import { useLog } from '../providers/buildLibrary';
import { clickById } from "../clickById";
import { click } from "../../automation/click";
import { MercariLogIn } from "../MercariLogIn";
import { ifNotExistDo } from "../ifNotExistDo";
import { writeFile } from '../../common/fs/writeFile';

export function TaxonomyScraper({ reader }: { reader: DataOrModifiedFn<Webdriver.Browser<'async'>> }) {
    const browser = reader();
    const log = useLog();
    useEffect(() => {
        async function subSubCategory() {
            await click(browser)(webdriver.selectors.listingForm.subSubCategory);
            const result = await browser.$$(webdriver.selectors.listingForm.subSubCategoryList).map(async (el) => {
                const label = await el.getText();
                const id = await el.getAttribute('id');
                log(`label: ${label} id: ${id}`);

                await ifNotExistDo(browser, log)(id, webdriver.selectors.listingForm.subSubCategory);
                await clickById(browser)(id);
                return { label, id };
            });
            return result;
        }
        async function subcategory() {
            await click(browser)(webdriver.selectors.listingForm.subCategory);
            const result = await browser.$$(webdriver.selectors.listingForm.subCategoryList).map(async (el) => {
                const label = await el.getText();
                const id = await el.getAttribute('id');
                log(`label: ${label} id: ${id}`);
                await ifNotExistDo(browser, log)(id, webdriver.selectors.listingForm.subCategory);
                await clickById(browser)(id);
                const children = await subSubCategory();
                return { label, id, children };
            });
            return result;
        }
        function handle(arr: any[]) {
            return async function (el: WebdriverIO.Element) {
                const id = await el.getAttribute('id');
                const label = await el.getText();
                return arr.push({ category: id, label });
            };
        }
        async function handleSubCategories(subcats: { category: string; subcategory: string }[], accum = [] as any[]): Promise<any[]> {
            if (subcats.length === 0) return accum;
            const [{ category, subcategory }, ...tail] = subcats;
            if (!(await browser.$('ul#categoryId').isExisting())) {
                log(`ul#categoryId-not exist`);
                await click(browser)(webdriver.selectors.listingForm.category);
            }
            await browser.pause(100);
            await clickById(browser)(category);
            await browser.pause(100);
            if (!(await browser.$('ul#subCategoryId').isExisting())) {
                log(`ul#subCategoryId-not exist`);
                await click(browser)(webdriver.selectors.listingForm.subCategory);
            }
            // await browser.pause(1000);
            await clickById(browser)(subcategory);
            // await browser.pause(1000);
            await click(browser)(webdriver.selectors.listingForm.subSubCategory);
            const els = await browser.$$(webdriver.selectors.listingForm.subSubCategoryList).map(async (el) => {
                const id = await el.getAttribute('id');
                const label = await el.getText();
                log(JSON.stringify({ category, subcategory, subsubcategory: id, label }));
                accum.push({ category, subcategory, subsubcategory: id, label });
            });
            await click(browser)(webdriver.selectors.listingForm.subSubCategory);
            return await handleSubCategories(tail, accum);
        }
        async function handleCategory(cats: { category: string }[], accum = [] as any[]): Promise<any[]> {
            if (cats.length === 0) return accum;
            const [head, ...tail] = cats;
            if (!(await browser.$('ul#categoryId').isExisting())) {
                log(`ul#categoryId-not exist`);
                await click(browser)(webdriver.selectors.listingForm.category);
            }
            await browser.pause(100);
            log(`handling ${JSON.stringify(head)}`);
            await clickById(browser)(head.category);
            // await browser.pause(1000);
            await click(browser)(webdriver.selectors.listingForm.subCategory);
            await browser.pause(100);
            const p = await browser.$$(webdriver.selectors.listingForm.subCategoryList).map(async (x) => {
                const id = await x.getAttribute('id');
                const label = await x.getText();
                accum.push({ category: head.category, subcategory: id, label });
            });
            await click(browser)(webdriver.selectors.listingForm.subCategory);

            return await handleCategory(tail, accum);
        }
        async function run() {
            await browser.url(webdriver.urls.mercari);
            await MercariLogIn(browser);
            await click(browser)(webdriver.selectors.listingForm.category);
            const els = await browser.$$(webdriver.selectors.listingForm.categoryList);
            console.log(els);
            const categories: { category: string; label: string }[] = [];
            await Promise.all(els.map(handle(categories)));

            await click(browser)(webdriver.selectors.listingForm.category);

            log('categories', JSON.stringify(categories));
            const subcategories = await handleCategory(categories);
            console.log('subcategories', subcategories);

            const subsubcategories = await handleSubCategories(subcategories);
            console.log('subsubcategories', subsubcategories);
            // await categories
            //     .map((category) => async () => {
            //         await click(browser)(webdriver.selectors.listingForm.category);
            //         const id = await category.getAttribute('id');
            //         const label = await category.getText();
            //         log(id, label);
            //         await category.click();
            //         await click(browser)(webdriver.selectors.listingForm.subCategory);
            //         const subcategories = await browser.$$(webdriver.selectors.listingForm.subCategoryList);
            //         await click(browser)(webdriver.selectors.listingForm.subCategory);
            //         // const children: any[] = [];
            //         await subcategories
            //             .map((subCategory) => async () => {
            //                 await click(browser)(webdriver.selectors.listingForm.subCategory);
            //                 const id2 = await subCategory.getAttribute('id');
            //                 const label2 = await subCategory.getText();
            //                 log(id2, label2);
            //                 await subCategory.click();
            //                 await click(browser)(webdriver.selectors.listingForm.subSubCategory);
            //                 const subSubCategories = await browser.$$(webdriver.selectors.listingForm.subSubCategoryList);
            //                 // const children2: { id: string; label: string }[] = [];
            //                 await subSubCategories
            //                     .map((subSubCategory) => async () => {
            //                         const id3 = await subSubCategory.getAttribute('id');
            //                         const label3 = await subSubCategory.getText();
            //                         log(id3, label3);
            //                         const entry = { category: { id, label }, subCategory: { id: id2, label: label2 }, subSubCategory: { id: id3, label: label3 }};
            //                         log('entry', JSON.stringify(entry));
            //                         result.push(entry);
            //                         // children2.push({ id: id3, label: label3 });
            //                     })
            //                     .reduce((pv, cv) => async () => {
            //                         await pv();
            //                         await cv();
            //                     })();
            //                 // children.push({ id: id2, label: label2, children: children2 });
            //             })
            //             .reduce((pv, cv) => async () => {
            //                 await pv();
            //                 await cv();
            //             })();
            //         // result.push({ id, label, children });
            //     })
            //     .reduce((pv, cv) => async () => {
            //         await pv();
            //         await cv();
            //     })();
            // .map(async (el) => {
            //     const label = await el.getText();
            //     const id = await el.getAttribute('id');
            //     log(`label: ${label} id: ${id}`);
            //     await ifNotExistDo(browser, log)(id, webdriver.selectors.listingForm.category);
            //     await clickById(browser)(id);
            //     const children = await subcategory();
            //     const r = { label, id, children }
            //     log(`r: ${JSON.stringify(r)}`);
            //     return r;
            // });
            return [...categories, ...subcategories, ...subsubcategories];
        }
        run()
            .then((x) => writeFile(files.categoryListings)(JSON.stringify({ categories: x })))
            .then((x) => {
                log('written', files.categoryListings);
            })
            .catch((e) => log(e.message));
        log('done');
    }, [browser, log]);
    return <></>;
}
