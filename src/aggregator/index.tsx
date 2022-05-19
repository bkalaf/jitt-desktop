// import EventEmitter from 'events';
// import { getAbsoluteDayFromDate } from '../common/date/getAbsoluteDayFromDate';
// import { getGregorianDataFromAbsoluteDay } from '../common/date/getGregorianDataFromAbsoluteDay';
// import { getFullPath } from '../common/fs/getFullPath';
// import { Settings } from './Settings';

import { useEffect, useMemo, useRef } from 'react';
import { ignore } from '../common';
import { getAbsoluteDayFromDate } from '../common/date/getAbsoluteDayFromDate';
import { getGregorianDataFromAbsoluteDay } from '../common/date/getGregorianDataFromAbsoluteDay';
import { toYearMonthDateFormat } from '../components/toYearMonthDateFormat';
import { Settings } from './Settings';

// export type IUnsubscribe = () => void;
// export type IListener = (...args: any[]) => void;

// export type BrandsArtifact = { uniqueBrands: [string, string][] };

// type ScheduleItemAction = 'scrape' | 'import';

// type ScheduleItemScope = 'brands' | 'categories' | 'taxonomy';

// export interface IScheduledAction {
//     when: Date;
//     action: ScheduleItemAction;
//     scope: ScheduleItemScope;
//     ready: boolean;
// }
// export type ISchedule = Array<IScheduledAction>;
// export type IScheduler = {
//     schedule: ISchedule;
//     next?: NodeJS.Timeout;
//     paused: boolean;
// };
// export class EventAggregator {
//     emitter: EventEmitter;
//     settings: Settings;
//     scheduler: IScheduler;
//     schedulerStatus: 'idle' | 'empty' | 'running' | 'pending';
//     constructor() {
//         this.emitter = new EventEmitter();
//         this.settings = new Settings();
//         this.scheduler = {
//             schedule: [],
//             paused: false
//         };
//         this.init();
//         this.loadScheduler();
//         this.schedulerStatus = 'idle';
//     }

//     startScheduler() {
//         if (this.scheduler.schedule.length > 0) {
//             this.schedulerStatus = 'running';
//             this.schedulerNext();
//             return;
//         }
//         this.schedulerStatus = 'empty';
//         this.schedulerIdle();
//         return;
//     }
//     whenChanged(type: 'add' | 'remove', item: any) {
//         if (type === 'add' && (this.schedulerStatus === 'empty' || this.schedulerStatus === 'idle')) {
//             this.schedulerRun();
//         } else if (type === 'remove' && this.scheduler.schedule.length === 0) {
//             this.schedulerStatus = 'empty';
//         }
//     }
//     pushScheduler(item: IScheduledAction) {
//         this.scheduler = {
//             ...this.scheduler,
//             schedule: [...this.scheduler.schedule, item].sort((itemA, itemB) => (itemA.when < itemB.when ? -1 : itemA.when > itemB.when ? 1 : 0))
//         };
//     }
//     init() {
//         const unsubs = [
//             this.onEndBrandsScrape(this.writeBrandsScrape),
//             this.onSchedulerNewItem(this.pushScheduler),
//             this.onLoadScheduler((x) => (this.scheduler = { schedule: x, paused: false })),
//             this.onSchedulerRun(this.startScheduler),
//             this.onSchedulerChanged(this.whenChanged)
//         ];
//     }
//     on<TArgs extends any[]>(event: string, listener: (...args: TArgs) => void): IUnsubscribe {
//         this.emitter.on(event, listener as IListener);
//         return () => this.emitter.off(event, listener as IListener);
//     }
//     trigger<TArgs extends any[]>(event: string, ...args: TArgs) {
//         this.emitter.emit(event, ...args);
//     }

//     onLoadScheduler(listener: (schedule: ISchedule) => void) {
//         return this.on(this.events.admin.scheduler.load, listener);
//     }
//     loadScheduler() {
//         const schedule: ISchedule = JSON.parse(this.settings.getKey(Settings.keys.admin.scheduler.queue));
//         this.trigger(this.events.admin.scheduler.load, schedule);
//         this.schedulerChanged('load', schedule);
//     }
//     onSchedulerNewItem(listener: (item: IScheduledAction) => void) {
//         return this.on(this.events.admin.scheduler.newItem, listener);
//     }
//     newSchedulerItem(action: ScheduleItemAction, scope: ScheduleItemScope, date: Date | number) {
//         const item: IScheduledAction = {
//             action,
//             scope,
//             when: typeof date === 'number' ? new Date(Date.parse(getGregorianDataFromAbsoluteDay(getAbsoluteDayFromDate(new Date(Date.now())) + date))) : date,
//             ready: true
//         };
//         this.trigger(this.events.admin.scheduler.newItem, item);
//         this.schedulerChanged('add', [item]);
//     }
//     onSchedulerChanged(listener: (changeType: 'add' | 'remove', item: IScheduledAction[]) => void) {
//         return this.on(this.events.admin.scheduler.changed, listener);
//     }
//     schedulerChanged(changeType: 'add' | 'remove' | 'load', item: IScheduledAction[]) {
//         this.trigger(this.events.admin.scheduler.changed, changeType, item);
//     }
//     onSchedulerRun(listener: () => void) {
//         return this.on(this.events.admin.scheduler.run, listener);
//     }
//     schedulerRun() {
//         this.trigger(this.events.admin.scheduler.run);
//     }
//     onScheduleIdle(listener: () => void) {
//         return this.on(this.events.admin.scheduler.idle, listener);
//     }
//     schedulerIdle() {
//         this.trigger(this.events.admin.scheduler.idle);
//     }
//     onScheduleNext(listener: () => void) {
//         return this.on(this.events.admin.scheduler.next, listener);
//     }
//     schedulerNext() {}
//     onScheduleItemComplete(listener: () => void) {
//         return this.on(this.events.admin.scheduler.itemComplete, listener);
//     }
//     onSchedulerSave(listener: () => void) {
//         return this.on(this.events.admin.scheduler.save, listener);
//     }
//     events = {
//         admin: {
//             scheduler: {
//                 load: ['admin', 'scheduler', 'get'].join('::'),
//                 newItem: ['admin', 'scheduler', 'newItem'].join('::'),
//                 run: ['admin', 'scheduler', 'pop'].join('::'),
//                 idle: ['admin', 'scheduler', 'idle'].join('::'),
//                 next: ['admin', 'scheduler', 'next'].join('::'),
//                 save: ['admin', 'scheduler', 'save'].join('::'),
//                 changed: ['admin', 'scheduler', 'changed'].join('::'),
//                 itemComplete: ['admin', 'scheduler', 'item-complete'].join('::')
//             },
//             scrape: {
//                 start: ['admin', 'scrape', 'start'].join('::'),
//                 end: ['admin', 'scrape', 'end'].join('::'),
//                 stamp: ['admin', 'scrape', 'stamp'].join('::'),
//                 write: ['admin', 'scrape', 'write'].join('::')
//             },
//             import: {
//                 ready: ['admin', 'import', 'ready'].join('::')
//             }
//         }
//     };
//     onStartScrape(listener: (key: 'brands' | 'categories') => void) {
//         return this.on(this.events.admin.scrape.start, listener);
//     }
//     onStampBrandsScrape(listener: () => void) {}
//     startScrape(key: 'brands' | 'categories') {
//         this.trigger(this.events.admin.scrape.start, key);
//     }
//     onStartBrandsScrape(listener: () => void): IUnsubscribe {
//         return this.on(EventAggregator.eventNames.admin.scrape.brands.start, listener);
//     }
//     startBrandsScrape() {
//         this.trigger(EventAggregator.eventNames.admin.scrape.brands.start);
//     }
//     onEndBrandsScrape(listener: (artifact: BrandsArtifact) => void): IUnsubscribe {
//         return this.on(EventAggregator.eventNames.admin.scrape.brands.end, listener);
//     }
//     endBrandsScrape(artifact: BrandsArtifact) {
//         this.trigger(EventAggregator.eventNames.admin.scrape.brands.end, artifact);
//     }
//     onWriteBrandsScrape(listener: (artifact: BrandsArtifact) => void) {
//         return this.on(EventAggregator.eventNames.admin.scrape.brands.write, listener);
//     }
//     writeBrandsScrape(artifact: BrandsArtifact) {
//         this.trigger(EventAggregator.eventNames.admin.scrape.brands.write, artifact);
//     }

//     static eventNames = {
//         admin: {
//             scheduler: {
//                 newItem: ['admin', 'scheduler', 'newItem'].join('::')
//             },
//             scrape: {
//                 brands: {
//                     start: ['admin', 'scrape', 'brands', 'start'].join('::'),
//                     end: ['admin', 'scrape', 'brands', 'end'].join('::'),
//                     write: ['admin', 'scrape', 'brands', 'write'].join('::'),
//                     stamp: ['admin', 'scrape', 'brands', 'stamp'].join('::')
//                     // changed: ['admin', 'scrape', 'brands', 'changed'].join('::')
//                 },
//                 categories: {
//                     start: ['admin', 'scrape', 'categories', 'start'].join('::'),
//                     end: ['admin', 'scrape', 'categories', 'end'].join('::'),
//                     write: ['admin', 'scrape', 'categories', 'write'].join('::'),
//                     stamp: ['admin', 'scrape', 'categories', 'stamp'].join('::')
//                     // ready: ['admin', 'scrape', 'categories', 'changed'].join('::')
//                 }
//             },
//             import: {
//                 brands: {
//                     start: ['admin', 'import', 'brands', 'start'].join('::'),
//                     end: ['admin', 'import', 'brands', 'end'].join('::'),
//                     stamp: ['admin', 'import', 'brands', 'stamp'].join('::'),
//                     remove: ['admin', 'import', 'brands', 'remove'].join('::'),
//                     ready: ['admin', 'import', 'brands', 'ready'].join('::')
//                 },
//                 categories: {
//                     start: ['admin', 'import', 'categories', 'start'].join('::'),
//                     end: ['admin', 'import', 'categories', 'end'].join('::'),
//                     stamp: ['admin', 'import', 'categories', 'stamp'].join('::'),
//                     remove: ['admin', 'import', 'categories', 'remove'].join('::'),
//                     ready: ['admin', 'import', 'categories', 'ready'].join('::')
//                 },
//                 taxonomy: {
//                     start: ['admin', 'import', 'taxonomy', 'start'].join('::'),
//                     end: ['admin', 'import', 'taxonomy', 'end'].join('::'),
//                     stamp: ['admin', 'import', 'taxonomy', 'stamp'].join('::'),
//                     remove: ['admin', 'import', 'taxonomy', 'remove'].join('::'),
//                     ready: ['admin', 'import', 'taxonomy', 'ready'].join('::')
//                 }import { toYearMonthDateFormat } from '../components/toYearMonthDateFormat';

//             }
//         }
//     };
// }

// // const ee = new EventAggregator();
// // const unsub1 = ee.on('test', (arg: string) => console.log(`listener #1 ${arg}`))
// // ee.on('test', (arg: string) => console.log(`listener #2 ${arg}`))

// // console.log(ee.emitter.listeners('test'));
// // ee.trigger('test', 'ARG1');
// // unsub1();>\t'));

export function now() {
    return new Date(Date.now());
}

export function calculateCountdown(date: Date) {
    return date.valueOf() - new Date(Date.now()).valueOf();
}


// export function ScheduledAction({ when, offset, action, scope }: { when?: Date, offset?: number; action: 'scrape' | 'import'; scope: 'brands' | 'categories' | 'taxonomy' }) {
//     const target = useMemo(() => when != null ? when : new Date(Date.parse(getGregorianDataFromAbsoluteDay(getAbsoluteDayFromDate(now()) + (offset ?? 0)))), [offset, when]);
//     const timeoutMs = useMemo(() => calculateCountdown(target), [target]);
//     const callback = useRef<NodeJS.Timeout | undefined>(undefined);
//     useEffect(() => {
//         callback.current = setTimeout(() => {
//             alert(`action: ${action} scope: ${scope}`);
//             const settings = Settings.Instance;
//             settings!.setKey(Settings.keys.admin[action][scope].lastRun, now().valueOf().toString());
//             settings!.setKey(Settings.keys.admin[action][scope].nextRun, new Date(Date.parse(getGregorianDataFromAbsoluteDay(getAbsoluteDayFromDate(now()) + 14))).valueOf().toString());
//         }, timeoutMs);
//         return () => callback.current != null ? clearTimeout(callback.current) : ignore();
//     }, [action, scope, timeoutMs]);

// }