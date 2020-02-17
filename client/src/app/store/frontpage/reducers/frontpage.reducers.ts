import * as FrontPageActions from './../actions/frontpage.actions';
import { IFrontPageEntity } from './../../../models/frontpage';
import { Action } from '@ngrx/store';

export interface IFrontPageState {
    frontPageEntities: IFrontPageEntity[];
}

export const initialState = {
    frontPageEntities: []
};

export function FrontPageReducer (state = initialState, action: FrontPageActions.FrontPageActions) {
    switch (action.type) {
        case FrontPageActions.GET_FRONTPAGE_POSTS_SUCCESS:
        console.log('GET_FRONTPAGE_POSTS_SUCCESS', action.payload);
            return {
                ...state,
                frontPageEntities: action.payload
            };
        default:
            return state;
    }
};
