import * as FeedActions from '../actions/feed.actions';
import { ActionReducer } from '@ngrx/store';

export interface FeedState {
    subscribeToFeedResult: string;
    featuredFeeds: any[];
}

export const initialState: FeedState = {
    subscribeToFeedResult: '',
    featuredFeeds: null
};

export function FeedReducer (state = initialState, action: FeedActions.FeedActions) {
    switch (action.type) {
        case FeedActions.SUBSCRIBE_TO_FEED_RESULT:
            return {
                ...state,
                subscribeToFeedResult: action.payload
            };
        case FeedActions.SET_RETRIEVED_FEATURED_FEEDS:
            return {
                ...state,
                featuredFeeds: action.payload
            };
        default:
            return state;
    }
};
