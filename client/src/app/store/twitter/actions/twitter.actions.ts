import { Action } from '@ngrx/store';

export const SEARCH_FEEDS = 'SEARCH_FEEDS';
export const SET_SEARCH_FEEDS_RESULT = 'SET_SEARCH_FEEDS_RESULT';
export const TWITTER_DATA_ERROR = 'TWITTER_DATA_ERROR';

export class SearchFeeds implements Action {
    readonly type = SEARCH_FEEDS;
    constructor(public payload: string) { }
}
export class SetSearchFeedsResult implements Action {
    readonly type = SET_SEARCH_FEEDS_RESULT;
    constructor(public payload: {
        data: any[]
    }) { }
}
export class TwitterDataError implements Action {
    readonly type = TWITTER_DATA_ERROR;
    constructor(public payload: string) { }
}
export type TwitterActions = SearchFeeds | SetSearchFeedsResult | TwitterDataError;
