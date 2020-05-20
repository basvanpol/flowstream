
import { IGroup } from './../../../../../../api/src/tsmodels/groups';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { IGroupState } from "../reducers/group.reducer"
import { IAppState } from '../../app/app.state';

export const getGroupState = createFeatureSelector<IAppState, IGroupState>('group');

export const selectMutatedGroup = createSelector(
  getGroupState,
    (state) => {
      return state.mutatedGroup;
    }
);
