import Realm from 'realm';
import { makeVar } from '@apollo/client';
export const realmApp = new Realm.App('jitt-mntcv');

export const $currentUser = makeVar(realmApp.currentUser);
export const $realm = makeVar<Realm | undefined>(undefined);
