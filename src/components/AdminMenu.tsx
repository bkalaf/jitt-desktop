/* eslint-disable react/jsx-key */
import { DataOrModifiedFn } from 'use-async-resource';
import * as Webdriver from 'webdriverio';
import { makeVar } from '@apollo/client';
import EventEmitter from 'events';
import { ActivityComponent } from './ActivityComponent';
import { importTaxonomy } from './importTaxonomy';
import { importCategories } from './importCategories';
import { importBrands } from './importBrands';
import useLocalRealm from '../hooks/useLocalRealm';
import { useQuery } from 'react-query';
import { Admin } from '../data';
import { GroupingHeader } from './GroupingHeader';
import { MenuGrouping } from './MenuGrouping';
import { ignore } from '../common';
import { restoreBackup } from './importBackup';
import { $ } from '../data/$';

export function MenuSection({ children }: { children: Children }) {
    return <div className='flex flex-col w-full space-y-3 text-black border rounded-lg shadow-md border-blue-dark shadow-yellow'>{children}</div>;
}

/**
 * @description
 * @author Robert Kalaf Jr.
 * @date 05/18/2022
 * @export
 * @param {{ reader: DataOrModifiedFn<Webdriver.Browser<'async'>> }} { reader }
 * @returns {*}
 */
export function AdminMenu({ reader }: { reader: DataOrModifiedFn<Webdriver.Browser<'async'>> }) {
    const realm = useLocalRealm();
    const { data: activity } = useQuery(
        ['selectAll', $.activity],
        () => {
            return Promise.resolve(realm.objects<Admin.Activity>($.activity));
        },
        { suspense: true }
    );
    return (
        <section className='flex flex-col flex-grow p-0.5 border border-white rounded-md space-x-4 bg-slate-minimal'>
            <header className='flex w-full h-10 text-black bg-white border border-black rounded-md'>Menu</header>
            <div className='grid w-full grid-cols-3 mx-5 my-3 space-x-3'>
                <MenuSection>
                    <GroupingHeader action='scrape'>WEB SCRAPES</GroupingHeader>
                    {/* <ActivityEnvelope>
                        <ActivityEntry keySegment={$activityKeys.brandsScrape} repeatInDays={2} ActivityEl={BrandScraper} reader={reader} />
                        <ActivityEntry keySegment={$activityKeys.taxonomyScrape} repeatInDays={15} ActivityEl={TaxonomyScraper} reader={reader} />
                        <ActivityEntry keySegment={$activityKeys.fileSystemSync} repeatInDays={9} ActivityEl={Dummy} reader={reader} />
                        <ActivityEntry keySegment={$activityKeys.selectorCheck} repeatInDays={-7} ActivityEl={Dummy} reader={reader} />
                    </ActivityEnvelope> */}
                    <MenuGrouping>
                        <ActivityComponent action='scrape' scope='brands' activity={activity} mutationFunc={ignore as any} doNotRun />
                        <ActivityComponent action='scrape' scope='categories' activity={activity} mutationFunc={ignore as any} doNotRun />
                        <ActivityComponent action='scrape' scope='taxonomy' activity={activity} mutationFunc={ignore as any} doNotRun />
                    </MenuGrouping>
                </MenuSection>
                <MenuSection>
                    <GroupingHeader action='import'>IMPORT JSON</GroupingHeader>
                    <MenuGrouping>
                        <ActivityComponent action='import' scope='brands' activity={activity} mutationFunc={importBrands} doNotRun />
                        <ActivityComponent action='import' scope='categories' activity={activity} mutationFunc={importCategories} doNotRun />
                        <ActivityComponent action='import' scope='taxonomy' activity={activity} mutationFunc={importTaxonomy} doNotRun />
                    </MenuGrouping>

                    <GroupingHeader>INTEGRITY</GroupingHeader>
                    <MenuGrouping>{/* <IntegrityActivity keySegment='verifiedBrands-dedupe' ActionComponent={IntegrityCheckBrands} /> */}</MenuGrouping>
                </MenuSection>
                <MenuSection>
                    <GroupingHeader action='back-up'>BACK UP & RESTORE</GroupingHeader>
                    <MenuGrouping>
                        <ActivityComponent action='back-up' scope='restore' activity={undefined} mutationFunc={restoreBackup} />
                    </MenuGrouping>
                    <div>Print Barcodes</div>
                </MenuSection>
            </div>
            <footer className='flex'>
                <div className='inline-flex'>
                    <span className='inline-flex'>Tasks Overdue :</span>
                    <span className='inline-flex'>0</span>
                </div>
            </footer>
        </section>
    );
}

export const $$eventAggregator = makeVar<EventEmitter>(new EventEmitter());

export const $$eventNames = {
    executeAction: 'execute-action'
};
