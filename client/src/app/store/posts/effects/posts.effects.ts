import * as PostsActions from './../actions/posts.actions';
import { of } from 'rxjs/internal/observable/of';
import { switchMap, catchError, mergeMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PostsService } from '../../../services/http/posts.service';


@Injectable()
export class PostsEffects {
    errorMessage: string;
    constructor(private actions$: Actions, private postsService: PostsService) {
        this.errorMessage = "Unfortunately feeds posts data couldn't be loaded";
    }
    @Effect()
    loadFeedPosts$ = this.actions$
        .pipe(
            ofType(PostsActions.PostsActionTypes.LOAD_FEED_POSTS),
            switchMap((action: PostsActions.LoadFeedPosts) => {
                return this.postsService.getFeedPosts(action.payload)
                    .pipe(
                        switchMap((res) => {

                            if (res && res.data) {
                                return [new PostsActions.LoadFeedPostsSuccess(res.data)];
                            } else {
                                return [];
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new PostsActions.FeedPostsDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );


    // this is used when an image is scraped and the original post needs to be updated
    @Effect()
    updatePost$ = this.actions$
        .pipe(
            ofType(PostsActions.PostsActionTypes.UPDATE_POST),
            mergeMap((action: PostsActions.UpdatePost) => {
                return this.postsService.updatePost(action.payload)
                    .pipe(
                        mergeMap((res) => {
                            if (res) {
                                return [new PostsActions.UpdatePostSuccessful('post updated successfully')];
                            } else {
                                return [];
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new PostsActions.FeedPostsDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );

    // this is used when a feed post is added to a flow
    @Effect()
    saveNewPost$ = this.actions$
        .pipe(
            ofType(PostsActions.PostsActionTypes.SAVE_POST),
            mergeMap((action: PostsActions.SavePost) => {
                return this.postsService.savePost(action.payload)
                    .pipe(
                        mergeMap((res) => {
                            if (res) {

                                return [new PostsActions.SavePostSuccessful('new post updated successfully')];
                            } else {
                                return [];
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new PostsActions.FeedPostsDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );

    @Effect()
    deletePost$ = this.actions$
        .pipe(
            ofType(PostsActions.PostsActionTypes.DELETE_POST),
            mergeMap((action: PostsActions.DeletePost) => {
                return this.postsService.deletePost(action.payload)
                    .pipe(
                        mergeMap((res) => {
                            if (res) {

                                return [new PostsActions.DeletePostSuccessful('delete post successful')];
                            } else {
                                return [];
                            }
                        })
                        , catchError((err) => {
                            return of(
                                new PostsActions.FeedPostsDataError(this.errorMessage)
                            );
                        })
                    );
            }),
    );
}
