import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../flow/selectors/flow.selectors';
import { TwitterState } from '../reducers/twitter.reducer';

export const getTwitterState = createFeatureSelector<IAppState, TwitterState>('twitter');
