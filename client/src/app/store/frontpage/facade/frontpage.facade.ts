import { selectFrontPagePosts } from './../selectors/frontpage.selectors';
import { IUserFeedSubscription } from './../../../models/feed';
import { Subscription } from 'rxjs';
import { IAuthState } from './../../auth/reducers/auth.reducer';
import { AuthFacade } from './../../auth/facade/auth.facade';
import * as FrontPageActions from './../actions/frontpage.actions';
import * as FrontPageReducer from './../reducers/frontpage.reducers';
import { Store, select } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { Injectable, OnDestroy } from "@angular/core";
import { untilDestroyed } from 'ngx-take-until-destroy';

@Injectable()
export class FrontPageFacade implements OnDestroy {

    private authState$: Subscription;
    private authState: IAuthState;
    private userAuthenticated = false;


    public frontPagePosts$ = this.store.pipe(
        select(selectFrontPagePosts)
    );

    constructor(private store: Store<any>, authFacade: AuthFacade) {
        this.authState$ = authFacade.authState$.pipe(untilDestroyed(this)).subscribe((authState: IAuthState) => {
            this.authState = authState;
            if (this.authState.authenticated && this.authState.authenticated !== this.userAuthenticated) {
                if (this.authState.feedSubscriptions && this.authState.feedSubscriptions.length > 0) {
                    this.getFrontPagePosts(this.authState.feedSubscriptions);
                }
            }
        });
    }

    public getFrontPagePosts(feedSubscriptions: IUserFeedSubscription[]) {
        this.store.dispatch(new FrontPageActions.GetFrontPagePosts(feedSubscriptions));
    }

    ngOnDestroy() { }
}
