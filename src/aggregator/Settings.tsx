import { toYearMonthDateFormat } from '../components/toYearMonthDateFormat';
import { files } from '../config';

export class Settings {
    static Instance?: Settings;
    static getInstance() {
        if (Settings.Instance == null) {
            Settings.Instance = new Settings();
        }
        return Settings.Instance;
    }
    storageImplementation: Storage;
    initKey(key: string, defaultValue?: string) {
        if (!this.hasKey(key) && defaultValue != null) {
            this.setKey(key, defaultValue);
        }
    }
    hasKey(key: string) {
        return this.storageImplementation.getItem(key) != null;
    }
    getKey(key: string) {
        const result = this.storageImplementation.getItem(key);
        if (result == null) throw new Error(`key: ${key} does not exist`);
        return result;
    }
    setKey(key: string, value: string) {
        return this.storageImplementation.setItem(key, value);
    }
    initStampKey(scope: 'scrape' | 'import', context: 'brands' | 'categories' | 'taxonomy') {
        this.initKey(Settings.keys.admin[scope][context].lastRun, '1900-01-01');
        this.initKey(Settings.keys.admin[scope][context].nextRun, toYearMonthDateFormat(new Date(Date.now())));
    }
    constructor(storageImplementation = localStorage) {
        this.storageImplementation = storageImplementation;
        this.initKey(Settings.keys.admin.scheduler.queue, JSON.stringify({ queue: [] }));
        this.initStampKey('scrape', 'brands');
        this.initStampKey('scrape', 'categories');
        this.initStampKey('scrape', 'taxonomy');
        this.initStampKey('import', 'brands');
        this.initStampKey('import', 'categories');
        this.initStampKey('import', 'taxonomy');
        this.initKey(Settings.keys.admin.scrape.brands.artifact, files.brandListings);
        this.initKey(Settings.keys.admin.scrape.categories.artifact, files.categoryListings);
        this.initKey(Settings.keys.admin.scrape.taxonomy.artifact, files.taxonomyListings);
    }
    static keys = {
        admin: {
            scheduler: {
                queue: ['jitt', 'admin', 'scheduler', 'queue'].join('::')
            },
            scrape: {
                brands: {
                    lastRun: ['jitt', 'admin', 'scrape', 'brands', 'lastRun'].join('::'),
                    nextRun: ['jitt', 'admin', 'scrape', 'brands', 'nextRun'].join('::'),
                    artifact: ['jitt', 'admin', 'scrape', 'brands', 'artifact'].join('::')
                },
                categories: {
                    lastRun: ['jitt', 'admin', 'scrape', 'categories', 'lastRun'].join('::'),
                    nextRun: ['jitt', 'admin', 'scrape', 'categories', 'nextRun'].join('::'),
                    artifact: ['jitt', 'admin', 'scrape', 'categories', 'artifact'].join('::')
                },
                taxonomy: {
                    lastRun: ['jitt', 'admin', 'scrape', 'taxonomy', 'lastRun'].join('::'),
                    nextRun: ['jitt', 'admin', 'scrape', 'taxonomy', 'nextRun'].join('::'),
                    artifact: ['jitt', 'admin', 'scrape', 'taxonomy', 'artifact'].join('::')
                }
            },
            import: {
                brands: {
                    lastRun: ['jitt', 'admin', 'import', 'brands', 'lastRun'].join('::'),
                    nextRun: ['jitt', 'admin', 'import', 'brands', 'nextRun'].join('::'),
                },
                categories: {
                    lastRun: ['jitt', 'admin', 'import', 'categories', 'lastRun'].join('::'),
                    nextRun: ['jitt', 'admin', 'import', 'categories', 'nextRun'].join('::'),
                },
                taxonomy: {
                    lastRun: ['jitt', 'admin', 'import', 'taxonomy', 'lastRun'].join('::'),
                    nextRun: ['jitt', 'admin', 'import', 'taxonomy', 'nextRun'].join('::'),
                }
            }
        }
    };
}
