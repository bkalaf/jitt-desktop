import { makeVar, useReactiveVar } from '@apollo/client';
import { ipcRenderer } from 'electron';
import React, { useContext } from 'react';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Spinner } from '../Spinner';
import * as Webdriver from 'webdriverio';
import { DataOrModifiedFn, useAsyncResource } from 'use-async-resource';

export function createWebdriver() {
    return Webdriver.remote({
        logLevel: 'trace',
        capabilities: {
            browserName: 'chrome',
        }   
    });
}

export interface IWebdriverContext {
    url(x: string): Promise<string | undefined>;
    click(selector: string): Promise<void>;
}

