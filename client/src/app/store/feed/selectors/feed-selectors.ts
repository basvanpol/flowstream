import { createFeatureSelector } from '@ngrx/store';
import { FeedState } from '../reducers/feed.reducer';
import { IAppState } from '../../flow/selectors/flow.selectors';

export const getFeedsState = createFeatureSelector<IAppState, FeedState>('feeds');
