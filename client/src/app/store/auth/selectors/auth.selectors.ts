import { IAuthState } from './../reducers/auth.reducer';
import { IAppState } from './../../flow/selectors/flow.selectors';
import { createFeatureSelector } from '@ngrx/store';

export const getAuthState = createFeatureSelector<IAppState, IAuthState>('auth');
