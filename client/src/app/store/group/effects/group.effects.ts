import { GroupService } from '../../../services/http/group.service';
import * as GroupActions from '../actions/group.actions';
import { GroupVM } from '../../../models/group';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import {  of } from 'rxjs';


@Injectable()
export class GroupEffects {
  errorMessage: string;
  constructor(private actions$: Actions, private groupService: GroupService ) {
  }

  @Effect()
  saveGroup$ = this.actions$.pipe(
    ofType(GroupActions.GroupActionTypes.SaveGroup),
    switchMap((action: GroupActions.SaveGroup) => {
      return this.groupService.saveGroup(<GroupVM>action.payload)
        .pipe(
          map((res: any) => {
            // console.log('save group success', res);
            if (res) {
              return new GroupActions.SaveGroupSuccess(res.group);
            }
          })
          , catchError((err) => {
            return of(
              new GroupActions.GroupDataError(this.errorMessage)
            );
          })
        );
    })
  );

  @Effect()
  deleteGroup$ = this.actions$.pipe(
    ofType(GroupActions.GroupActionTypes.DeleteGroup),
    switchMap((action: GroupActions.DeleteGroup) => {
      return this.groupService.deleteGroup(<string>action.payload._id)
        .pipe(
          map((res: any) => {
            if (res) {
              return new GroupActions.DeleteGroupSuccess(action.payload);
            }
          })
          , catchError((err) => {
            return of(
              new GroupActions.GroupDataError(this.errorMessage)
            );
          })
        );
    })
  );

  @Effect()
  loadAdminGroups$ = this.actions$.pipe(
    ofType(GroupActions.GroupActionTypes.LoadAdminGroups),
    switchMap((action: GroupActions.LoadAdminGroups) => {
      return this.groupService.loadAdminGroups()
        .pipe(
          map((res: any) => {
            if (res) {
              return new GroupActions.LoadAdminGroupsSuccess(res);
            } else {
              return new GroupActions.LoadAdminGroupsError(this.errorMessage);
            }
          })
          , catchError((err) => {
            return of(
              new GroupActions.LoadAdminGroupsError(this.errorMessage),
              new GroupActions.GroupDataError(this.errorMessage)
            );
          })
        );
    })
  );
}
