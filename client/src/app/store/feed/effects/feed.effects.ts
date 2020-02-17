import { FeedSubscription } from '../../../models/feed';
import { FeedState } from '../reducers/feed.reducer';
import { FeedService } from '../../../services/http/feed.service';
import * as FeedActions from '../actions/feed.actions';
import * as AuthActions from '../../auth/actions/auth.actions';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class FeedEffects {
    errorMessage: string;
    constructor(private actions$: Actions, private feedService: FeedService, private store: Store<FeedState>) {
        this.errorMessage = "Unfortunately feeds data couldn't be loaded";
    }

    @Effect()
    subscribeTofeed$ = this.actions$
        .pipe(
            ofType(FeedActions.SUBSCRIBE_TO_FEED),
            switchMap((action: FeedActions.SubscribeTofeed) => {
                console.log('kumbaya');
                return this.feedService.subscribeToFeed(<FeedSubscription>action.payload)
                    .pipe(
                        switchMap((res) => {
                            if (res && res.data) {
                                if (!res.data.user) {
                                    return [new FeedActions.SubscribeTofeedResult(res.data.featuredFeeds)];
                                } else if (res.data.user && res.data.featuredFeeds) {
                                    return [
                                        new AuthActions.SetUser(res.data.user),
                                        new FeedActions.SubscribeTofeedResult(res.data.featuredFeeds)
                                    ];
                                }
                            } else {
                                return [];
                            }
                        })
                        , catchError((err) => {
                            console.log('err', err);
                            return of(
                                new FeedActions.FeedDataError(this.errorMessage)
                            );
                        })
                    );
            })
        );


    @Effect()
    unsubscribeFromfeed$ = this.actions$
        .pipe(
            ofType(FeedActions.UNSUBSCRIBE_FROM_FEED),
            switchMap((action: FeedActions.UnsubscribeFromFeed) => {
                console.log('unsubscribe');
                return this.feedService.unsubscribeFromFeed(<FeedSubscription>action.payload)
                    .pipe(
                        switchMap((res) => {
                            if (res && res.data) {
                                if (!res.data.user) {
                                    return [new FeedActions.UnsubscribeFromFeedResult(res.data.featuredFeeds)];
                                } else if (res.data.user && res.data.featuredFeeds) {
                                    return [
                                        new AuthActions.SetUser(res.data.user),
                                        new FeedActions.UnsubscribeFromFeedResult(res.data.featuredFeeds)
                                    ];
                                }
                            } else {
                                return [];
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new FeedActions.FeedDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );

    @Effect()
    addToFeatureList$ = this.actions$
        .pipe(
            ofType(FeedActions.ADD_TO_FEATURE_LIST),
            switchMap((action: FeedActions.AddToFeatureList) => {
                console.log('kumbaya', action.payload);
                return this.feedService.addToFeatureList(<FeedSubscription>action.payload)
                    .pipe(
                        switchMap((res) => {
                            if (res && res.data) {
                                if (!res.data.user) {
                                    return [new FeedActions.SetRetrievedFeaturedFeeds(res.data.featuredFeeds)];
                                } else if (res.data.user && res.data.featuredFeeds) {
                                    return [
                                        new AuthActions.SetUser(res.data.user),
                                        new FeedActions.SetRetrievedFeaturedFeeds(res.data.featuredFeeds)
                                    ];
                                }
                            } else {
                                return [];
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new FeedActions.FeedDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );


    @Effect()
    retrieveFeaturedFeeds$ = this.actions$
        .pipe(
            ofType(FeedActions.GET_FEATURE_FEEDS),
            switchMap((action: FeedActions.GetFeatureFeeds) => {
                console.log('get featured feeds');
                return this.feedService.getFeaturedFeeds()
                    .pipe(
                        switchMap((res) => {
                            if (res && res.data) {
                                if (!res.data.user) {
                                    return [new FeedActions.SetRetrievedFeaturedFeeds(res.data.featuredFeeds)];
                                } else if (res.data.user && res.data.featuredFeeds) {
                                    return [
                                        new AuthActions.SetUser(res.data.user),
                                        new FeedActions.SetRetrievedFeaturedFeeds(res.data.featuredFeeds)
                                    ];
                                }
                            } else {
                                return [];
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new FeedActions.FeedDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );
}

