import { getFullPath, getFullPathMaintenance } from '../components/getFullPath';

export const files = {
    brands: getFullPathMaintenance('brands.txt'),
    brandsDone: getFullPathMaintenance('brands-done.txt'),
    brandsTodo: getFullPathMaintenance('brands-todo.txt'),
    brandListings: getFullPath('brands.json', 'appData', 'jitt-desktop')
};
export const APP_CONFIG = {
    appFolder: 'jitt-desktop',
    db: {
        path: getFullPath('db.realm', 'appData', 'jitt-desktop')
    },
    maintenance: {
        brandsLastFetched: '2022-01-01T12:00:00+07:00',
        scheduler: {
            nextBrandFetch: '2022-01-08T12:00:00+07:00'
        }
    },
    credentials: {
        mercari: {
            username: 'bobby.kalaf.jr@gmail.com',
            password: 'Achilles@92111'
        }
    }
};
