import * as TwitterActions from '../actions/twitter.actions';
import { Twitter } from '../../../models/twitter';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { TwitterService } from '../../../services/http/twitter.service';
import { TwitterState } from '../reducers/twitter.reducer';

@Injectable()
export class TwitterEffects {
    errorMessage: string;
    constructor(private actions$: Actions, private twitterService: TwitterService, private store: Store<TwitterState>) {
        this.errorMessage = "Unfortunately twitter data coudln't be loaded";
    }

    @Effect()
    retrievePortfolios$ = this.actions$
        .pipe(
            ofType(TwitterActions.SEARCH_FEEDS),
            switchMap((action: TwitterActions.SearchFeeds) => {
                return this.twitterService.searchFeeds(<string>action.payload)
                    .pipe(
                        map((res: any) => {
                            if (res) {
                                return new TwitterActions.SetSearchFeedsResult(res);
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new TwitterActions.TwitterDataError(this.errorMessage)
                            );
                        })
                    );
            }),
        );
}
