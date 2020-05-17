import * as GroupActions from '../actions/group.actions';
import { Action } from '@ngrx/store';
import { GroupVM } from '../../../models/group';


export interface GroupState {
  selectedAdminGroup: GroupVM;
  adminGroups: GroupVM[];
  saveGroupSuccess: boolean;
  loading: boolean;
}

export const initialState: GroupState = {
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
  loading: false
};

export function reducer(state = initialState, action: GroupActions.GroupActions): GroupState {
  switch (action.type) {
    case GroupActions.GroupActionTypes.DeleteGroupSuccess:
    case GroupActions.GroupActionTypes.LoadAdminGroupsSuccess:
      return {
        ...state,
        adminGroups: action.payload.groups
      };
    case GroupActions.GroupActionTypes.SaveGroupSuccess:
      const newAdminGroups = [...state.adminGroups];
      const savedGroup = action.payload.group;
      console.log('savedGroup', savedGroup);
      console.log('state.adminGroups', state.adminGroups);
      if (!!savedGroup) {
        const groupIndex = state.adminGroups.findIndex((group) => group._id.toString() === savedGroup._id.toString());
        console.log('groupIndex', groupIndex);
        if (groupIndex !== -1) {
          newAdminGroups[groupIndex] = savedGroup;
          console.log('hoezee')
        } else {
          newAdminGroups.push(savedGroup);
        }
      }
      console.log('newAdminGroups', newAdminGroups);
      return {
        ...state,
        adminGroups: newAdminGroups,
        saveGroupSuccess: true
      };
    case GroupActions.GroupActionTypes.SaveGroupReset:
      return {
        ...state,
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
