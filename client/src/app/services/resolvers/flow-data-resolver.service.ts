import { FlowFacade } from './../../store/flow/facade/flow.facade';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Params, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
@Injectable()
export class FlowDataResolver implements Resolve<boolean> {
  private flowId: number;

  constructor(private flowFacade: FlowFacade, private route: ActivatedRoute) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.flowId = state.root.queryParams['flowId'];
    this.flowFacade.getFlowPosts(this.flowId);
    return true;
  };
};
