import { IPost } from '../../../models/post';
import { Action } from '@ngrx/store';

export enum PostsActionTypes {
  UPDATE_POST = 'UPDATE_POST',
  UPDATE_POST_SUCCESSFUL = 'UPDATE_POST_SUCCESSFUL',
  SAVE_POST = 'SAVE_POST',
  SAVE_POST_SUCCESSFUL = 'SAVE_POST_SUCCESSFUL',
  SELECT_POST = 'SELECT_POST',
  DELETE_POST = 'DELETE_POST',
  DELETE_POST_SUCCESSFUL = 'DELETE_POST_SUCCESSFUL',
  LOAD_FEED_POSTS = 'LOAD_FEED_POSTS',
  LOAD_FEED_POSTS_SUCCESS = 'LOAD_FEED_POSTS_SUCCESS',
  FEED_POSTS_DATA_ERROR = 'FEED_POSTS_DATA_ERROR'
}
export class UpdatePost implements Action {
  readonly type = PostsActionTypes.UPDATE_POST;
  constructor( public payload: IPost) {}
}
export class UpdatePostSuccessful implements Action {
  readonly type = PostsActionTypes.UPDATE_POST_SUCCESSFUL;
  constructor( public payload: string) {}
}
export class SavePost implements Action {
  readonly type = PostsActionTypes.SAVE_POST;
  constructor( public payload: IPost) {}
}
export class SelectPost implements Action {
  readonly type = PostsActionTypes.SELECT_POST;
  constructor( public payload: IPost) {}
}
export class SavePostSuccessful implements Action {
  readonly type = PostsActionTypes.SAVE_POST_SUCCESSFUL;
  constructor( public payload: string) {}
}
export class DeletePost implements Action {
  readonly type = PostsActionTypes.DELETE_POST;
  constructor( public payload: IPost) {}
}
export class DeletePostSuccessful implements Action {
  readonly type = PostsActionTypes.DELETE_POST_SUCCESSFUL;
  constructor( public payload: string) {}
}
export class LoadFeedPosts implements Action {
  readonly type = PostsActionTypes.LOAD_FEED_POSTS;
  constructor( public payload: {
    feedIds: string[],
    newSinceDate: number
  }) {}
}
export class LoadFeedPostsSuccess implements Action {
  readonly type = PostsActionTypes.LOAD_FEED_POSTS_SUCCESS;
  constructor( public payload: { posts: IPost[], newSinceDate: number } ) {}
}
export class FeedPostsDataError implements Action {
  readonly type = PostsActionTypes.FEED_POSTS_DATA_ERROR;
  constructor( public payload: string) {}
}

export type PostsActions = UpdatePost | UpdatePostSuccessful | SavePost | SavePostSuccessful | SelectPost |
DeletePost | DeletePostSuccessful | LoadFeedPosts | LoadFeedPostsSuccess | FeedPostsDataError;
