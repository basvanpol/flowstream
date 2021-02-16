import { createFeatureSelector } from '@ngrx/store';
import { FeedState } from '../reducers/feed.reducer';
import { IAppState } from '../../app/app.state';

export const getFeedsState = createFeatureSelector<IAppState, FeedState>('feeds');
