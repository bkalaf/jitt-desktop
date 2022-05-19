import React from 'react';
import { DataOrModifiedFn } from 'use-async-resource';
import * as Webdriver from 'webdriverio';

export function Dummy({ reader }: { reader: DataOrModifiedFn<Webdriver.Browser<'async'>>; }) {
    return <></>;
}
