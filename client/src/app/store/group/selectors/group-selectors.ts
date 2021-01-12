import { createFeatureSelector } from '@ngrx/store';
import { IAppState } from '../../flow/selectors/flow.selectors';
import { GroupState } from '../reducers/group.reducer';

export const getGroupState = createFeatureSelector<IAppState, GroupState>('groups');
