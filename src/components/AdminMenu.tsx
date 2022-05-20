/* eslint-disable react/jsx-key */
import React, { cloneElement, useRef } from 'react';
import { ActivityContainerProvider, useActivityContainer } from './ActivityLastRun';
import { BrandScraper } from './BrandScraper';
import { DataOrModifiedFn } from 'use-async-resource';
import * as Webdriver from 'webdriverio';
import { TaxonomyScraper } from './ActionComponents/CategoryScraper';
import { RunActivityButton } from './RunActivityButton';
import { $activityKeys } from './$activityKeys';
import { makeVar } from '@apollo/client';
import { useLog } from './providers/buildLibrary';
import { rangeBetween } from '../common/array/rangeBetween';
import { months } from '../data/enums/months';
import { ActivityEntry } from './ActivityEntry';
import EventEmitter from 'events';
import { useEventListener } from '../hooks/useEventListener';
import { ImportActivity } from './ImportActivity';
import { ActivityComponent } from "./ActivityComponent";
import { importTaxonomy } from "./importTaxonomy";
import { importCategories } from "./importCategories";
import { importBrands } from "./importBrands";
import { ImportVerifiedBrands, IntegrityCheckBrands } from './ImportVerifiedBrands';
import { useLocalStorageKey } from './useLocalStorageKey';
import { useToggle } from '../hooks/useToggle';
import { ModalContainer } from './ModalContainer';
import { DuotoneButton } from './providers/DuotoneBtn';
import { faWindowClose } from '@fortawesome/pro-duotone-svg-icons';
import { useLocalRealm } from '../hooks/useLocalRealm';
import { useQuery } from 'react-query';
import { Activity, mongo } from '../data';
import { GroupingHeader } from './GroupingHeader';
import { MenuGrouping } from './MenuGrouping';
import { ignore } from '../common';


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
    const { data: activity } = useQuery(['selectAll', mongo.activity], () => {
        return Promise.resolve(realm.objects<Activity>(mongo.activity))
    }, { suspense: true });
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
                        <ActivityComponent action='scrape' scope='brands' activity={activity} mutationFunc={ignore as any}/>
                        <ActivityComponent action='scrape' scope='categories' activity={activity} mutationFunc={ignore as any}/>
                        <ActivityComponent action='scrape' scope='taxonomy' activity={activity} mutationFunc={ignore as any}/>
                    </MenuGrouping>
                    
                </MenuSection>
                <MenuSection>
                    <GroupingHeader action='import'>IMPORT JSON</GroupingHeader>
                    <MenuGrouping>
                        <ActivityComponent action='import' scope='brands' activity={activity} mutationFunc={importBrands}/>
                        <ActivityComponent action='import' scope='categories' activity={activity} mutationFunc={importCategories} />
                        <ActivityComponent action='import' scope='taxonomy' activity={activity} mutationFunc={importTaxonomy} />
                    </MenuGrouping>

                    <GroupingHeader>INTEGRITY</GroupingHeader>
                    <MenuGrouping>
                        {/* <IntegrityActivity keySegment='verifiedBrands-dedupe' ActionComponent={IntegrityCheckBrands} /> */}
                    </MenuGrouping>
                </MenuSection>
                <MenuSection>
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

export function useActionComponent(El: React.FunctionComponent) {
    const [engage, toggleEngage] = useToggle(false);

    return (
        <>
            {engage && (
                <ModalContainer>
                    <DuotoneButton primary='yellow' secondary='purple' icon={faWindowClose} size='lg' onClick={toggleEngage} />
                    <El />
                </ModalContainer>
            )}
        </>
    );
}

export const $$eventAggregator = makeVar<EventEmitter>(new EventEmitter());

export const $$eventNames = {
    executeAction: 'execute-action'
};

