
import { Store, select } from '@ngrx/store';
import { Injectable, OnDestroy } from '@angular/core';
import { IGroupState } from '../reducers/group.reducer';
import { IAppState } from '../../app/app.state';
import { selectMutatedGroup } from '../selectors/group.selectors';
@Injectable()
export class GroupFacade implements OnDestroy{

  constructor(private store: Store<any>) { }

  public mutatedGroup$ = this.store.pipe(
    select(selectMutatedGroup)
  );

  ngOnDestroy() {}

};
