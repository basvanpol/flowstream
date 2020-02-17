import { createEntityAdapter } from '@ngrx/entity';
import { IAppState } from './../../flow/selectors/flow.selectors';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IFrontPageState } from '../reducers/frontpage.reducers';

export const getFrontPageState = createFeatureSelector<IAppState, IFrontPageState>('frontpage');

export const selectFrontPagePosts = createSelector(
    getFrontPageState,
    (state) => {
      return state.frontPageEntities;
    }
);

