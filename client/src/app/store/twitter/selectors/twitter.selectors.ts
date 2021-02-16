import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../app/app.state';
import { TwitterState } from '../reducers/twitter.reducer';

export const getTwitterState = createFeatureSelector<IAppState, TwitterState>('twitter');
