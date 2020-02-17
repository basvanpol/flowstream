import { FlowVM } from '../../../models/flow';
import { FeedSubscription } from '../../../models/feed';
import { IFlowState } from '../reducers/flow.reducers';
import { FlowService } from '../../../services/http/flow.service';
import * as FlowActions from '../actions/flow.actions';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class FlowEffects {
    errorMessage: string;
    constructor(private actions$: Actions, private flowService: FlowService, private store: Store<IFlowState>) {
        this.errorMessage = "Unfortunately flow data couldn't be Loaded. Apologies for the inconvencience.";
    }

    @Effect()
    saveFlow$ = this.actions$
        .pipe(
            ofType(FlowActions.SAVE_FLOW),
            switchMap((action: FlowActions.SaveFlow) => {
                return this.flowService.saveFlow(<FlowVM>action.payload)
                    .pipe(
                        map((res: any) => {
                            if (res) {
                                return new FlowActions.SaveFlowResult(res.data.flows);
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new FlowActions.FlowDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );


    @Effect()
    deleteFlow$ = this.actions$
        .pipe(
            ofType(FlowActions.DELETE_FLOW),
            switchMap((action: FlowActions.DeleteFlow) => {
                console.log('delete flow');
                return this.flowService.deleteFlow(<number>action.payload)
                    .pipe(
                        map((res: any) => {
                            console.log('flow deleted ', res);
                            if (res) {
                                return new FlowActions.DeleteFlowResult(res.data.flows);
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new FlowActions.FlowDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );

    @Effect()
    retrieveFlow$ = this.actions$
        .pipe(
            ofType(FlowActions.RETRIEVE_FLOWS),
            switchMap((action: FlowActions.RetrieveFlows) => {
                console.log('delete flow');
                return this.flowService.retrieveFlows()
                    .pipe(
                        map((res: any) => {
                            console.log('flow retrieved ', res);
                            if (res) {
                                return new FlowActions.RetrieveFlowsSuccess(res.data.flows);
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new FlowActions.FlowDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );

    @Effect()
    retrieveFlowPosts$ = this.actions$
        .pipe(
            ofType(FlowActions.RETRIEVE_FLOW_POSTS),
            switchMap((action: FlowActions.RetrieveFlowPosts) => {
                console.log('retrieve flow posts');
                return this.flowService.retrieveFlowPosts(<number>action.payload)
                    .pipe(
                        map((res: any) => {
                            console.log('flow posts retrieved ', res);
                            if (res) {
                                return new FlowActions.RetrieveFlowPostsSuccess(res.data);
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new FlowActions.FlowDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );
}
