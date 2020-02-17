import { IUserFeedSubscription } from './../../../models/feed';
import { Action } from '@ngrx/store';
export const GET_FRONTPAGE_POSTS = 'GET_FRONTPAGE_POSTS';
export const GET_FRONTPAGE_POSTS_SUCCESS = 'GET_FRONTPAGE_POSTS_SUCCESS';
export const FRONTPAGE_DATA_ERROR = 'FRONTPAGE_DATA_ERROR';

export class GetFrontPagePosts implements Action {
 readonly type = GET_FRONTPAGE_POSTS;
 constructor( public payload: IUserFeedSubscription[]) {}
}
export class GetFrontPagePostsSuccess implements Action {
    readonly type = GET_FRONTPAGE_POSTS_SUCCESS;
    constructor(public payload: any) {}
}
export class FrontPageDataError implements Action {
    readonly type = FRONTPAGE_DATA_ERROR;
    constructor(public payload: any) {}
}


export type FrontPageActions = GetFrontPagePosts | GetFrontPagePostsSuccess | FrontPageDataError;
