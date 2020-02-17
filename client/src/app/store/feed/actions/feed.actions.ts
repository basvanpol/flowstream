import { FeedSubscription } from '../../../models/feed';
import { Action } from '@ngrx/store';

export const GET_FEATURE_FEEDS = 'GET_FEATURE_FEEDS';
export const SET_RETRIEVED_FEATURED_FEEDS = 'SET_RETRIEVED_FEATURED_FEEDS';
export const SUBSCRIBE_TO_FEED = 'SUBSCRIBE_TO_FEED';
export const SUBSCRIBE_TO_FEED_RESULT = 'SUBSCRIBE_TO_FEED_RESULT';
export const UNSUBSCRIBE_FROM_FEED = 'UNSUBSCRIBE_FROM_FEED';
export const UNSUBSCRIBE_FROM_FEED_RESULT = 'UNSUBSCRIBE_FROM_FEED_RESULT';
export const ADD_TO_FEATURE_LIST = 'ADD_TO_FEATURE_LIST';
export const ADD_TO_FEATURE_LIST_RESULT = 'ADD_TO_FEATURE_LIST_RESULT';
export const FEED_DATA_ERROR = 'FEED_DATA_ERROR';

export class GetFeatureFeeds implements Action {
    readonly type = GET_FEATURE_FEEDS;
}
export class SetRetrievedFeaturedFeeds implements Action {
    readonly type = SET_RETRIEVED_FEATURED_FEEDS;
    constructor(public payload: any[]) { }
}
export class SubscribeTofeed implements Action {
    readonly type = SUBSCRIBE_TO_FEED;
    constructor(public payload: FeedSubscription) { }
}
export class SubscribeTofeedResult implements Action {
    readonly type = SUBSCRIBE_TO_FEED_RESULT;
    constructor(public payload: string) { }
}
export class UnsubscribeFromFeed implements Action {
    readonly type = UNSUBSCRIBE_FROM_FEED;
    constructor(public payload: FeedSubscription) { }
}
export class UnsubscribeFromFeedResult implements Action {
    readonly type = UNSUBSCRIBE_FROM_FEED_RESULT;
    constructor(public payload: String) { }
}
export class AddToFeatureList implements Action {
    readonly type = ADD_TO_FEATURE_LIST;
    constructor(public payload: FeedSubscription) { }
}
export class AddToFeatureListResult implements Action {
    readonly type = ADD_TO_FEATURE_LIST_RESULT;
    constructor(public payload: string) { }
}
export class FeedDataError implements Action {
    readonly type = FEED_DATA_ERROR;
    constructor(public payload: string) { }
}
export type FeedActions = GetFeatureFeeds | SetRetrievedFeaturedFeeds | SubscribeTofeed | SubscribeTofeedResult |
    UnsubscribeFromFeed | UnsubscribeFromFeedResult | AddToFeatureList | AddToFeatureListResult | FeedDataError;
