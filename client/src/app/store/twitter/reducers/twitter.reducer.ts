import * as TwitterActions from '../actions/twitter.actions';
import { ActionReducer } from '@ngrx/store';

export interface TwitterState {
    searchFeedsResult: {
        data: any[]
    };
}

export const initialState: TwitterState = {
    searchFeedsResult: {
        data: []
    }
};

export function TwitterReducer (state = initialState, action: TwitterActions.TwitterActions) {
    switch (action.type) {
        case TwitterActions.SET_SEARCH_FEEDS_RESULT:
        console.log('TwitterActions.SET_SEARCH_FEEDS_RESULT', action.payload );
            return {
                ...state,
                searchFeedsResult: action.payload
            };
        default:
            return state;
    }
};
