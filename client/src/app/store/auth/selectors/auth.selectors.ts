import { IAuthState } from './../reducers/auth.reducer';

import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../app/app.state';

export const getAuthState = createFeatureSelector<IAppState, IAuthState>('auth');
