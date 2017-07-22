import {combineReducers} from 'redux';

import {IConfig} from '../../interfaces/IConfig';
import {IJodelAction} from '../../interfaces/IJodelAction';
import {IToken} from '../../interfaces/IToken';
import {
    SET_CONFIG,
    SET_DEVICE_UID,
    SET_KARMA,
    SET_PERMISSION_DENIED,
    SET_RECOMMENDED_CHANNELS,
    SET_TOKEN,
} from '../actions';
import {SET_LOCAL_CHANNELS} from '../actions/state';

export const ACCOUNT_VERSION = 3;
export function migrateAccount(storedState: IAccountStore, oldVersion: number): IAccountStore {
    storedState.permissionDenied = false;
    if (oldVersion < 2) {
        storedState.recommendedChannels = [];
    }
    if (oldVersion < 3) {
        storedState.localChannels = [];
    }
    return storedState;
}

export interface IAccountStore {
    karma: number
    deviceUid: string
    token: IToken | null
    config: IConfig | null
    permissionDenied: boolean
    recommendedChannels: string[]
    localChannels: string[]
}

export const account = combineReducers<IAccountStore>({
    karma,
    deviceUid,
    token,
    config,
    permissionDenied,
    recommendedChannels,
    localChannels,
});

function karma(state = 0, action: IJodelAction): typeof state {
    switch (action.type) {
    case SET_KARMA:
        return action.payload.karma;
    default:
        return state;
    }
}

function deviceUid(state: string = null, action: IJodelAction): typeof state {
    switch (action.type) {
    case SET_DEVICE_UID:
        return action.payload.deviceUid;
    default:
        return state;
    }
}

function token(state: IToken = null, action: IJodelAction): typeof state {
    switch (action.type) {
    case SET_TOKEN:
        return action.payload.token;
    default:
        return state;
    }
}

function config(state: IConfig = null, action: IJodelAction): typeof state {
    switch (action.type) {
    case SET_CONFIG:
        return action.payload.config;
    default:
        return state;
    }
}

function permissionDenied(state: boolean = false, action: IJodelAction): typeof state {
    switch (action.type) {
    case SET_TOKEN:
        return false;
    case SET_PERMISSION_DENIED:
        return action.payload.permissionDenied;
    default:
        return state;
    }
}

function recommendedChannels(state: string[] = [], action: IJodelAction): typeof state {
    switch (action.type) {
    case SET_RECOMMENDED_CHANNELS:
        return action.payload.channelNames;
    default:
        return state;
    }
}

function localChannels(state: string[] = [], action: IJodelAction): typeof state {
    switch (action.type) {
    case SET_LOCAL_CHANNELS:
        return action.payload.channelNames;
    default:
        return state;
    }
}