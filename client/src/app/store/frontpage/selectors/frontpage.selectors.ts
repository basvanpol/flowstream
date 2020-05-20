import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IFrontPageState } from '../reducers/frontpage.reducers';
import { IAppState } from '../../app/app.state';

export const getFrontPageState = createFeatureSelector<IAppState, IFrontPageState>('frontpage');

export const selectFrontPagePosts = createSelector(
    getFrontPageState,
    (state) => {
      return state.frontPageEntities;
    }
);

