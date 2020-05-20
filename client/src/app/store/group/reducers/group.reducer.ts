import * as GroupActions from '../actions/group.actions';
import { Action } from '@ngrx/store';
import { GroupVM } from '../../../models/group';

export enum GroupMutations {
  SAVED = 1,
  DELETED = 2
}

export interface IMutatedGroup {
  group: GroupVM;
  mutation: GroupMutations;
}

export interface IGroupState {
  selectedAdminGroup: GroupVM;
  adminGroups: GroupVM[];
  saveGroupSuccess: boolean;
  loading: boolean;
  mutatedGroup?: IMutatedGroup;
}

export const initialState: IGroupState = {
  selectedAdminGroup: {
    _id: null,
    _user: null,
    title: '',
    icon: {
      type: null,
      value: ''
    }
  },
  adminGroups: null,
  saveGroupSuccess: false,
  loading: false,
  mutatedGroup: null
};

export function reducer(state = initialState, action: GroupActions.GroupActions): IGroupState {
  switch (action.type) {
    case GroupActions.GroupActionTypes.DeleteGroupSuccess:
      let remainingGroups = [...state.adminGroups];
      const deletedGroup = action.payload;
      let dMutatedGroup: IMutatedGroup;
      if (!!deletedGroup) {
        remainingGroups = state.adminGroups.filter(group => group._id !== deletedGroup._id);
        dMutatedGroup = {
          group: deletedGroup,
          mutation: GroupMutations.DELETED
        };
      }
      console.log('remainingGroups', remainingGroups);
      return {
        ...state,
        mutatedGroup: (!!dMutatedGroup) ? { ...dMutatedGroup } : null,
        adminGroups: [...remainingGroups]
      };
    case GroupActions.GroupActionTypes.LoadAdminGroups:
      return {
        ...state,
        loading: true
      };
    case GroupActions.GroupActionTypes.LoadAdminGroupsSuccess:
      return {
        ...state,
        adminGroups: action.payload.groups,
        loading: false
      };
    case GroupActions.GroupActionTypes.LoadAdminGroupsError:
      return {
        ...state,
        loading: false
      };
    case GroupActions.GroupActionTypes.SaveGroupSuccess:
      const newAdminGroups = [...state.adminGroups];
      const savedGroup = action.payload;
      let mutatedGroup: IMutatedGroup;
      if (!!savedGroup) {
        const groupIndex = state.adminGroups.findIndex((group) => group._id.toString() === savedGroup._id.toString());
        if (groupIndex !== -1) {
          newAdminGroups[groupIndex] = savedGroup;
        } else {
          newAdminGroups.push(savedGroup);
        }
        mutatedGroup = {
          group: savedGroup,
          mutation: GroupMutations.SAVED
        };
      }
      console.log('newAdminGroups', newAdminGroups);
      return {
        ...state,
        adminGroups: [...newAdminGroups],
        mutatedGroup: (!!mutatedGroup) ? { ...mutatedGroup } : null,
        saveGroupSuccess: true
      };
    case GroupActions.GroupActionTypes.SaveGroupReset:
      return {
        ...state,
        mutatedGroup: null,
        saveGroupSuccess: false
      };
    case GroupActions.GroupActionTypes.SelectGroup:
      return {
        ...state,
        selectedAdminGroup: action.payload
      };
    default:
      return state;
  }
}
