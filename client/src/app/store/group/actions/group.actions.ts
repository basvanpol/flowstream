import { GroupVM } from '../../../models/group';
import { Action } from '@ngrx/store';

export enum GroupActionTypes {
  LoadGroups = 'Load Groups',
  LoadGroupsSuccess = 'LoadGroupsSuccess',
  SaveGroup = 'SaveGroup',
  SaveGroupSuccess = 'SaveGroupSuccess',
  SaveGroupReset = 'SaveGroupReset',
  GroupDataError = 'GroupDataError',
  LoadAdminGroups = 'LoadAdminGroups',
  LoadAdminGroupsSuccess = 'LoadAdminGroupsSuccess',
  SelectGroup = 'SelectGroup',
  DeleteGroup = 'DeleteGroup',
  DeleteGroupSuccess = 'DeleteGroupSuccess'
}

export class LoadGroups implements Action {
  readonly type = GroupActionTypes.LoadGroups;
}
export class LoadGroupsSuccess implements Action {
  readonly type = GroupActionTypes.LoadGroupsSuccess;
  constructor(public payload: any) { }
}
export class LoadAdminGroups implements Action {
  readonly type = GroupActionTypes.LoadAdminGroups;
}
export class LoadAdminGroupsSuccess implements Action {
  readonly type = GroupActionTypes.LoadAdminGroupsSuccess;
  constructor(public payload: {
    msg: string;
    groups: any[];
  }) { }
}
export class SaveGroup implements Action {
  readonly type = GroupActionTypes.SaveGroup;
  constructor(public payload: GroupVM) { }
}
export class SaveGroupSuccess implements Action {
  readonly type = GroupActionTypes.SaveGroupSuccess;
  constructor(public payload: string) { }
}
export class DeleteGroup implements Action {
  readonly type = GroupActionTypes.DeleteGroup;
  constructor(public payload: number) { }
}
export class DeleteGroupSuccess implements Action {
  readonly type = GroupActionTypes.DeleteGroupSuccess;
  constructor(public payload: {
    msg: string;
    groups: any[];
  }) { }
}
export class SaveGroupReset implements Action {
  readonly type = GroupActionTypes.SaveGroupReset;
}
export class GroupDataError implements Action {
  readonly type = GroupActionTypes.GroupDataError;
  constructor(public payload: string) { }
}
export class SelectGroup implements Action {
  readonly type = GroupActionTypes.SelectGroup;
  constructor(public payload: GroupVM) { }
}

export type GroupActions = LoadGroups | LoadGroupsSuccess | SaveGroup | SaveGroupSuccess | 
DeleteGroup | DeleteGroupSuccess | SaveGroupReset
  | GroupDataError | LoadAdminGroups | LoadAdminGroupsSuccess | SelectGroup;
