import * as FlowActions from './../actions/flow.actions';
import { IFlowState } from './../reducers/flow.reducers';
import { FlowVM } from './../../../models/flow';
import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { getFlowsState, selectAllFlows } from '../selectors/flow.selectors';

@Injectable()
export class FlowFacade implements OnDestroy {

  flowsState: IFlowState;
  selectedFlow: FlowVM;

  public flowState$ = this.store.pipe(
    select(getFlowsState)
  );

  public flows$ = this.store.pipe(
    select(selectAllFlows)
  );

  constructor(private store: Store<any>) { }

  ngOnDestroy() {

  }

  public getFlowPosts(flowId: number) {
    this.store.dispatch(new FlowActions.RetrieveFlowPosts(flowId));
  }
  public deleteFlow(flowId: number) {
    this.store.dispatch(new FlowActions.DeleteFlow(flowId));
  }
}
