import * as FlowActions from './../../flow/actions/flow.actions';
import { ActionReducer } from '@ngrx/store';
import * as PostsActions from '../actions/posts.actions';
import { IPost } from '../../../models/post';

export interface PostsState {
  currentPosts: { posts: IPost[] };
  selectedPost: IPost;
  newSinceDate: number;
  selectedFeedIds: string[];
}

export const initialState: PostsState = {
  currentPosts: { posts: [] },
  selectedPost: null,
  newSinceDate: null,
  selectedFeedIds: null
};

export function postsReducer (state = initialState, action: PostsActions.PostsActions | FlowActions.FlowActions) {
  switch (action.type) {
    case PostsActions.PostsActionTypes.LOAD_FEED_POSTS:
      return {
        ...state,
        currentPosts: (!action.payload.newSinceDate) ? { posts: [] } : state.currentPosts,
        selectedFeedIds: action.payload.feedIds,
        newSinceDate: action.payload.newSinceDate
      };
    case PostsActions.PostsActionTypes.LOAD_FEED_POSTS_SUCCESS:
      return {
        ...state,
        currentPosts: {
          posts: [...state.currentPosts.posts].concat(action.payload.posts),
        },
        newSinceDate: action.payload.newSinceDate
      };
    case PostsActions.PostsActionTypes.SELECT_POST:
      return {
        ...state,
        selectedPost: action.payload
      };
    case FlowActions.RETRIEVE_FLOW_POSTS_SUCCESS:
      return {
        ...state,
        currentPosts: action.payload
      };
    default:
      return state;
  }
};


